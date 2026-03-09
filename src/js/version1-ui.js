$(document).ready(function() {
    // Eye toggle logic
    $('.toggle-btn').on('click', function(e) {
        e.preventDefault();
        $(this).toggleClass('eye-closed');
    });

    // Copy Buttons Logic
    $(document).on('click', '.copy-btn', function(e) {
        e.preventDefault();
        var $wrapper = $(this).closest('.input-action-wrapper');
        var $input = $wrapper.find('textarea, input');
        if ($input.length > 0) {
            $input.select();
            document.execCommand('copy');
            
            var originalHtml = $(this).html();
            $(this).html('<svg viewBox="0 0 24 24" width="18" height="18" stroke="#10B981" stroke-width="2" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>');
            var btn = $(this);
            setTimeout(function() { btn.html(originalHtml); }, 2000);
        }
    });

    // ==========================================
    // V7.2: ACCOUNT-BASED NETWORK DETECTOR & SEARCH LOGIC
    // ==========================================
    
    // Array of common networks that do NOT use change addresses (Account-based or Custom)
    var noChangeCoins = ['eth', 'ethereum', 'xrp', 'ripple', 'xlm', 'stellar', 'sol', 'solana', 'dot', 'polkadot', 'atom', 'cosmos', 'eos', 'trx', 'tron'];
    
    $('#network-phrase').on('change', function() {
        var selectedCoin = $(this).find('option:selected').text().toLowerCase();
        var isNoChange = noChangeCoins.some(function(coin) { return selectedCoin.includes(coin); });

        if (isNoChange) {
            // Hide Change Level UI and Guide for these coins
            $('.change-index-wrapper').hide();
            $('.change-scheme-info').hide();
            
            // Force change inputs to "0" safely
            var specificPathInputs = $('#change-bip44, #change-bip49, #change-bip84');
            specificPathInputs.val("0");
            if ($('.autoCompute').prop('checked')) {
                specificPathInputs.trigger('input');
            }
        } else {
            // Restore UI for UTXO coins like Bitcoin
            $('.change-index-wrapper').show();
            $('.change-scheme-info').show();
        }
        
        // Update dynamic scheme visualizer
        setTimeout(updateSchemeGuide, 50);
    });

    // ==========================================
    // DYNAMIC DERIVATION SCHEME GUIDE UPDATER
    // ==========================================
    function updateSchemeGuide() {
        // 1. Identify which tab is currently active (BIP44, BIP49, BIP84, etc.)
        var activeTab = $('.derivation-type .active a').attr('href');
        var basePath = "m/44'/0'/0'"; 
        var isCustomPath = false;

        // 2. Extract Purpose, Coin, and Account dynamically from the active UI inputs
        if (activeTab === "#bip44" || activeTab === "#bip49" || activeTab === "#bip84") {
            var prefix = activeTab.replace('#', ''); 
            var purpose = $('#purpose-' + prefix).val() || prefix.replace('bip', '');
            var coin = $('#coin-' + prefix).val() || "0";
            var account = $('#account-' + prefix).val() || "0";
            
            basePath = "m/" + purpose + "'/" + coin + "'/" + account + "'";
        } else if (activeTab === "#bip32") {
            basePath = $('#bip32-path').val();
            isCustomPath = true;
        } else if (activeTab === "#bip141") {
            basePath = $('#bip141-path').val();
            isCustomPath = true;
        }

        // Clean up trailing slashes just in case
        basePath = basePath.replace(/\/+$/, "");

        var mainPath, changePath, examplePath;

        // 3. Format the text appropriately depending on standard vs custom path
        if (isCustomPath) {
            mainPath = basePath + "/x";
            changePath = "Unavailable (Custom/Direct Path)";
            examplePath = basePath + "/5";
        } else {
            mainPath = basePath + "/0/x";
            changePath = basePath + "/1/x";
            examplePath = basePath + "/1/5";
        }

        // 4. Inject into the HTML
        $('#main-scheme-text').text(mainPath);
        $('#change-scheme-text').text(changePath);

        // 5. Update the "Filter" note depending on if the coin supports Change addresses
        var selectedCoin = $('#network-phrase').find('option:selected').text().toLowerCase();
        var isNoChange = noChangeCoins.some(function(coin) { return selectedCoin.includes(coin); });

        if (isNoChange || isCustomPath) {
            examplePath = isCustomPath ? examplePath : basePath + "/0/5"; // Adjust example for ETH/XRP
            $('#scheme-filter-note').html('<em>* Note: You can filter the table below to find specific addresses using paths (e.g. <code>' + examplePath + '</code>), Keys, or Addresses.</em>');
        } else {
            $('#scheme-filter-note').html('<em>* Note: You can filter the table below to find specific Main or Change addresses using paths (e.g. <code>' + examplePath + '</code>), Keys, or Addresses.</em>');
        }
    }

    // Call the updater when tabs or relevant inputs change
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        setTimeout(updateSchemeGuide, 50);
    });

    $('.account, #bip32-path, #bip141-path').on('input change', function() {
        updateSchemeGuide();
    });

    // Run once on load to initialize correctly
    setTimeout(updateSchemeGuide, 200);

    // ==========================================
    // SEARCH & FILTER LOGIC
    // ==========================================

    // Global variable to track the currently active search query
    var activeSearchQuery = "";

    // Target Change Level - Updates backend automatically when changed
    $('#dev-numeric-change').on('input', function() {
        var val = $(this).val();
        if(val === "") val = "0";
        var specificPathInputs = $('#change-bip44, #change-bip49, #change-bip84');
        specificPathInputs.val(val);
        if ($('.autoCompute').prop('checked')) specificPathInputs.trigger('input'); 
    });

    // Core Search & Filter Function
    function parseAndFilterTable(queryText) {
        var lowerQuery = queryText.toLowerCase();
        var specificPathInputs = $('#change-bip44, #change-bip49, #change-bip84');
        var currentChangeVal = specificPathInputs.val();

        // Smart parsing: Auto-switch Change level if user searches for paths containing /1/ or /0/
        if (lowerQuery.indexOf("/1/") > -1 && currentChangeVal !== "1") {
            specificPathInputs.val("1");
            $('#dev-numeric-change').val("1"); 
            if ($('.autoCompute').prop('checked')) specificPathInputs.trigger('input');
        } else if (lowerQuery.indexOf("/0/") > -1 && currentChangeVal !== "0") {
            specificPathInputs.val("0");
            $('#dev-numeric-change').val("0"); 
            if ($('.autoCompute').prop('checked')) specificPathInputs.trigger('input');
        }

        // Execute Visual Table Filter 
        setTimeout(function() {
            if(lowerQuery === '') {
                $('#derived-table tbody tr').show();
                $('#active-filter-display').addClass('hidden');
                return;
            }
            $('#derived-table tbody tr').filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(lowerQuery) > -1)
            });
            
            // Show Active Filter UI
            $('#active-filter-text').text(queryText);
            $('#active-filter-display').removeClass('hidden');
            
        }, 50); 
    }

    // Explicit Search Button Trigger
    $('#btn-search-table').on('click', function(e) {
        e.preventDefault();
        activeSearchQuery = $('#dev-table-filter').val().trim();
        parseAndFilterTable(activeSearchQuery);
        $('#dev-table-filter').val(''); // Clear the input box per command
    });

    // Allow 'Enter' key on search input
    $('#dev-table-filter').on('keypress', function(e) {
        if (e.which == 13) {
            e.preventDefault();
            activeSearchQuery = $('#dev-table-filter').val().trim();
            parseAndFilterTable(activeSearchQuery);
            $('#dev-table-filter').val(''); // Clear the input box per command
        }
    });
    
    // Clear Filter Button
    $('#btn-clear-filter').on('click', function(e) {
        e.preventDefault();
        activeSearchQuery = "";
        parseAndFilterTable("");
    });

    // Observe table for newly loaded rows to automatically apply the active filter
    var tableObserver = new MutationObserver(function() {
        if(activeSearchQuery !== '') {
            parseAndFilterTable(activeSearchQuery);
        }
    });
    
    var tbodyToObserve = document.querySelector('#derived-table tbody');
    if (tbodyToObserve) {
        tableObserver.observe(tbodyToObserve, { childList: true });
    }

});
