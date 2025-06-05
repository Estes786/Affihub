
'use strict';

(function() {
    const MAX_COMPARE_ITEMS = 4; // Max products to compare
    const STORAGE_KEY = 'comparisonItems';
    let allProductsData = []; // To store fetched product data
    let comparisonList = []; // Array of product IDs to compare

    // DOM Elements
    const productGrid = document.querySelector('.product-grid');
    const comparisonBar = document.getElementById('comparison-bar');
    const comparisonItemsContainer = document.getElementById('comparison-items');
    const compareNowButton = document.getElementById('compare-now-button');
    const clearComparisonButton = document.getElementById('clear-comparison-button');
    const comparisonModal = document.getElementById('comparison-modal');
    const closeModalButton = document.getElementById('close-modal-button');
    const comparisonTableContainer = document.getElementById('comparison-table-container');

    // --- Initialization ---
    async function initializeComparison() {
        loadComparisonState();
        try {
            const response = await fetch('products.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allProductsData = await response.json();
            // Initial UI update after data is loaded
            updateAllCompareButtonsUI();
            updateComparisonBar();
        } catch (error) {
            console.error('Error fetching product data:', error);
            // Handle error appropriately, maybe show a message to the user
        }
        addEventListeners();
    }

    // --- State Management ---
    function loadComparisonState() {
        const storedList = localStorage.getItem(STORAGE_KEY);
        comparisonList = storedList ? JSON.parse(storedList) : [];
    }

    function saveComparisonState() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(comparisonList));
    }

    function addToComparison(productId) {
        if (comparisonList.length >= MAX_COMPARE_ITEMS) {
            alert(`Anda hanya dapat membandingkan maksimal ${MAX_COMPARE_ITEMS} produk.`);
            return false;
        }
        if (!comparisonList.includes(productId)) {
            comparisonList.push(productId);
            saveComparisonState();
            return true;
        }
        return false;
    }

    function removeFromComparison(productId) {
        const index = comparisonList.indexOf(productId);
        if (index > -1) {
            comparisonList.splice(index, 1);
            saveComparisonState();
            return true;
        }
        return false;
    }

    function clearComparison() {
        comparisonList = [];
        saveComparisonState();
    }

    // --- UI Update Functions ---
    function updateCompareButtonUI(button, productId) {
        if (comparisonList.includes(productId)) {
            button.textContent = 'Hapus dari Perbandingan';
            button.classList.add('added');
        } else {
            button.textContent = 'Bandingkan';
            button.classList.remove('added');
        }
        // Disable button if max items reached and this item is not selected
        button.disabled = comparisonList.length >= MAX_COMPARE_ITEMS && !comparisonList.includes(productId);
    }

    function updateAllCompareButtonsUI() {
        const buttons = document.querySelectorAll('.compare-button');
        buttons.forEach(button => {
            const productId = button.dataset.id;
            updateCompareButtonUI(button, productId);
        });
    }

    function updateComparisonBar() {
        if (comparisonList.length === 0) {
            comparisonBar.classList.remove('visible');
            // Delay hiding slightly to allow animation
            setTimeout(() => { if (comparisonList.length === 0) comparisonBar.classList.add('hidden'); }, 300);
            return;
        }

        comparisonBar.classList.remove('hidden');
        comparisonBar.classList.add('visible');
        comparisonItemsContainer.innerHTML = ''; // Clear previous items

        comparisonList.forEach(productId => {
            const product = getProductById(productId);
            if (product) {
                const itemElement = document.createElement('div');
                itemElement.classList.add('comparison-item');
                itemElement.innerHTML = `
                    <img src="${product.image_url || '/placeholder.jpg'}" alt="${product.name}">
                    <span>${product.name.substring(0, 15)}${product.name.length > 15 ? '...' : ''}</span>
                    <button class="remove-item-button" data-id="${productId}" title="Hapus ${product.name}">&times;</button>
                `;
                comparisonItemsContainer.appendChild(itemElement);
            }
        });

        compareNowButton.textContent = `Bandingkan (${comparisonList.length})`;
        compareNowButton.disabled = comparisonList.length < 2;
    }

    function showModal() {
        renderComparisonTable();
        comparisonModal.classList.remove('hidden');
        comparisonModal.classList.add('visible');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    function hideModal() {
        comparisonModal.classList.remove('visible');
        comparisonModal.classList.add('hidden');
        document.body.style.overflow = ''; // Restore background scroll
    }

    // --- Data Handling ---
    function getProductById(productId) {
        return allProductsData.find(p => p.id === productId);
    }

    // --- Rendering Functions ---
    function renderComparisonTable() {
        if (comparisonList.length < 1) {
            comparisonTableContainer.innerHTML = '<p>Pilih minimal 2 produk untuk dibandingkan.</p>';
            return;
        }

        const productsToCompare = comparisonList.map(getProductById).filter(p => p);

        let tableHTML = '<table class="comparison-table"><thead><tr><th>Fitur</th>';
        productsToCompare.forEach(product => {
            tableHTML += `<th>
                            <img src="${product.image_url || '/placeholder.jpg'}" alt="${product.name}">
                            <div>${product.name}</div>
                         </th>`;
        });
        tableHTML += '</tr></thead><tbody>';

        // Helper to generate rows
        const generateRow = (label, key, renderFn) => {
            let row = `<tr><td>${label}</td>`;
            productsToCompare.forEach(product => {
                const value = key.split('.').reduce((o, i) => (o ? o[i] : undefined), product); // Access nested keys
                row += `<td>${renderFn ? renderFn(value, product) : (value || '-')}</td>`;
            });
            row += '</tr>';
            return row;
        };

        const generateListRow = (label, key) => {
            return generateRow(label, key, (value) => {
                if (Array.isArray(value) && value.length > 0) {
                    return `<ul>${value.map(item => `<li>${item}</li>`).join('')}</ul>`;
                }
                return '-';
            });
        };

        const generateAffiliateLinks = (value) => {
             if (Array.isArray(value) && value.length > 0) {
                    return value.map(link => `<a href="${link.url}" class="btn-compare-buy" target="_blank">Beli di ${link.platform}</a>`).join('<br>');
                }
                return '-';
        }

        // Add rows based on defined structure
        tableHTML += generateRow('Harga', 'price_display');
        tableHTML += generateRow('Rating', 'rating', (val) => val ? `${val} / 5` : '-');
        tableHTML += generateRow('Link Pembelian', 'affiliate_links', generateAffiliateLinks);

        tableHTML += '<tr class="section-header"><td colspan="100%">Fitur Utama</td></tr>';
        tableHTML += generateListRow('Fitur Kunci', 'features.key_features');
        tableHTML += generateListRow('Platform', 'features.platforms');
        tableHTML += generateListRow('Integrasi', 'features.integrations');

        tableHTML += '<tr class="section-header"><td colspan="100%">Penilaian</td></tr>';
        tableHTML += generateListRow('Kelebihan', 'assessment.pros');
        tableHTML += generateListRow('Kekurangan', 'assessment.cons');
        tableHTML += generateRow('Paling Cocok Untuk', 'assessment.best_for');

        tableHTML += '<tr class="section-header"><td colspan="100%">Info Tambahan</td></tr>';
        tableHTML += generateRow('Uji Coba Gratis', 'additional.trial_period');
        tableHTML += generateRow('Garansi Uang Kembali', 'additional.money_back_guarantee');
        tableHTML += generateRow('Tingkat Dukungan', 'additional.support_level');

        // Add final buy buttons row
         tableHTML += '<tr><td></td>';
         productsToCompare.forEach(product => {
             tableHTML += `<td>${generateAffiliateLinks(product.affiliate_links)}</td>`;
         });
         tableHTML += '</tr>';


        tableHTML += '</tbody></table>';
        comparisonTableContainer.innerHTML = tableHTML;
    }

    // --- Event Handlers ---
    function handleCompareButtonClick(event) {
        if (!event.target.classList.contains('compare-button')) return;

        const button = event.target;
        const productId = button.dataset.id;

        if (comparisonList.includes(productId)) {
            removeFromComparison(productId);
        } else {
            if (!addToComparison(productId)) return; // Stop if max reached
        }
        updateAllCompareButtonsUI();
        updateComparisonBar();
    }

    function handleRemoveItemClick(event) {
        if (!event.target.classList.contains('remove-item-button')) return;
        const productId = event.target.dataset.id;
        removeFromComparison(productId);
        updateAllCompareButtonsUI();
        updateComparisonBar();
    }

    function handleClearComparisonClick() {
        clearComparison();
        updateAllCompareButtonsUI();
        updateComparisonBar();
    }

    function handleCompareNowClick() {
        if (comparisonList.length >= 2) {
            showModal();
        }
    }

    // --- Add Event Listeners ---
    function addEventListeners() {
        // Use event delegation for product grid compare buttons
        if (productGrid) {
            productGrid.addEventListener('click', handleCompareButtonClick);
        }

        // Event delegation for remove buttons in the bar
        comparisonItemsContainer.addEventListener('click', handleRemoveItemClick);

        clearComparisonButton.addEventListener('click', handleClearComparisonClick);
        compareNowButton.addEventListener('click', handleCompareNowClick);
        closeModalButton.addEventListener('click', hideModal);

        // Close modal if clicking outside the content
        comparisonModal.addEventListener('click', (event) => {
            if (event.target === comparisonModal) {
                hideModal();
            }
        });

        // Close modal on Escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && comparisonModal.classList.contains('visible')) {
                hideModal();
            }
        });
    }

    // --- Start the process ---
    document.addEventListener('DOMContentLoaded', initializeComparison);

})();


