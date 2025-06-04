/**
 * GA4 Integration for AffiHub Analytics Dashboard
 * 
 * This file handles the integration between the AffiHub Analytics Dashboard
 * and Google Analytics 4 data using the Google Analytics Data API.
 */

// Configuration object for GA4 integration
const GA4Config = {
    // Your Google Analytics 4 Measurement ID
    measurementId: 'G-CM3MN6KHNX',
    
    // Date range defaults
    defaultDateRange: {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        endDate: new Date() // Today
    },
    
    // API endpoint (would be replaced with actual GA4 API endpoint)
    apiEndpoint: 'https://analyticsdata.googleapis.com/v1beta/',
    
    // Auto refresh interval in seconds (0 = manual refresh only)
    refreshInterval: 0
};

/**
 * Initialize the GA4 integration
 */
function initGA4Integration() {
    console.log('Initializing GA4 Integration...');
    
    // Set up event listeners
    document.getElementById('refreshData').addEventListener('click', fetchAllGA4Data);
    document.getElementById('applyFilters').addEventListener('click', applyGA4Filters);
    
    // Set up auto-refresh if enabled
    setupAutoRefresh();
    
    // Initial data fetch
    fetchAllGA4Data();
}

/**
 * Set up auto-refresh based on user settings
 */
function setupAutoRefresh() {
    const refreshIntervalSelect = document.getElementById('refreshInterval');
    if (refreshIntervalSelect) {
        refreshIntervalSelect.addEventListener('change', function() {
            const interval = parseInt(this.value);
            
            // Clear any existing interval
            if (window.ga4RefreshInterval) {
                clearInterval(window.ga4RefreshInterval);
                window.ga4RefreshInterval = null;
            }
            
            // Set up new interval if not manual
            if (interval > 0) {
                window.ga4RefreshInterval = setInterval(fetchAllGA4Data, interval * 1000);
                console.log(`Auto-refresh set to ${interval} seconds`);
            } else {
                console.log('Auto-refresh disabled, using manual refresh only');
            }
        });
    }
}

/**
 * Connect to Google Analytics 4
 * @returns {Promise} Promise resolving to connection status
 */
async function connectToGA4() {
    console.log('Connecting to Google Analytics 4...');
    
    try {
        // In a real implementation, this would use the gapi.client.analyticsdata library
        // to authenticate and connect to the GA4 API
        
        // For demonstration, we'll simulate a successful connection
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
            success: true,
            message: 'Connected to Google Analytics 4 successfully'
        };
    } catch (error) {
        console.error('Error connecting to GA4:', error);
        return {
            success: false,
            message: `Failed to connect to Google Analytics 4: ${error.message}`
        };
    }
}

/**
 * Fetch all GA4 data needed for the dashboard
 */
async function fetchAllGA4Data() {
    // Show loading state
    const refreshButton = document.getElementById('refreshData');
    refreshButton.disabled = true;
    refreshButton.innerHTML = '<i class="bi bi-arrow-repeat"></i> Memuat Data...';
    
    try {
        // Connect to GA4
        const connection = await connectToGA4();
        if (!connection.success) {
            throw new Error(connection.message);
        }
        
        // Get date range from filter inputs
        const dateRange = getSelectedDateRange();
        
        // Get other filters
        const filters = {
            productCategory: document.getElementById('productCategory').value,
            device: document.getElementById('deviceFilter').value
        };
        
        // Fetch different types of data in parallel
        const [summaryData, trendData, productData, trafficSourceData, demographicsData] = await Promise.all([
            fetchSummaryData(dateRange, filters),
            fetchTrendData(dateRange, filters),
            fetchProductPerformanceData(dateRange, filters),
            fetchTrafficSourceData(dateRange, filters),
            fetchDemographicsData(dateRange, filters)
        ]);
        
        // Update dashboard with fetched data
        updateSummaryCards(summaryData);
        updateTrendChart(trendData);
        updateProductPerformanceChart(productData);
        updateTrafficSourceChart(trafficSourceData);
        updateDemographicsCharts(demographicsData);
        updateProductTable(productData);
        
        // Show success message
        showToast('Data berhasil diperbarui dari Google Analytics!', 'success');
    } catch (error) {
        console.error('Error fetching GA4 data:', error);
        showToast(`Error: ${error.message}`, 'error');
    } finally {
        // Reset button state
        refreshButton.disabled = false;
        refreshButton.innerHTML = '<i class="bi bi-arrow-clockwise"></i> Refresh Data';
    }
}

/**
 * Apply filters to GA4 data
 */
function applyGA4Filters() {
    // Get all filter values
    const dateRange = getSelectedDateRange();
    const productCategory = document.getElementById('productCategory').value;
    const device = document.getElementById('deviceFilter').value;
    
    console.log('Applying filters:', { dateRange, productCategory, device });
    
    // Refresh data with new filters
    fetchAllGA4Data();
}

/**
 * Get the selected date range from the date picker
 * @returns {Object} Object with startDate and endDate
 */
function getSelectedDateRange() {
    const dateRangeInput = document.getElementById('dateRange');
    
    if (dateRangeInput && dateRangeInput.value) {
        const dates = dateRangeInput.value.split(' to ');
        
        if (dates.length === 2) {
            return {
                startDate: parseDate(dates[0]),
                endDate: parseDate(dates[1])
            };
        }
    }
    
    // Return default date range if input is invalid
    return GA4Config.defaultDateRange;
}

/**
 * Parse a date string in format DD/MM/YYYY
 * @param {string} dateStr Date string to parse
 * @returns {Date} Parsed date object
 */
function parseDate(dateStr) {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
}

/**
 * Format a date object to YYYY-MM-DD string (required by GA4 API)
 * @param {Date} date Date to format
 * @returns {string} Formatted date string
 */
function formatDateForGA4(date) {
    return date.toISOString().split('T')[0];
}

/**
 * Fetch summary data from GA4
 * @param {Object} dateRange Date range object with startDate and endDate
 * @param {Object} filters Additional filters to apply
 * @returns {Promise} Promise resolving to summary data
 */
async function fetchSummaryData(dateRange, filters) {
    console.log('Fetching summary data from GA4...');
    
    try {
        // In a real implementation, this would use the GA4 API to fetch actual data
        // For demonstration, we'll simulate an API call with a delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // This would be replaced with actual GA4 data
        return {
            totalClicks: 1248,
            clickGrowth: 12.5,
            estimatedRevenue: 4500000,
            revenueGrowth: 8.3,
            activeProducts: 24,
            newProducts: 3,
            averageCTR: 3.2,
            ctrGrowth: -0.5
        };
    } catch (error) {
        console.error('Error fetching summary data:', error);
        throw error;
    }
}

/**
 * Fetch trend data from GA4
 * @param {Object} dateRange Date range object with startDate and endDate
 * @param {Object} filters Additional filters to apply
 * @param {string} granularity Data granularity (daily, weekly, monthly)
 * @returns {Promise} Promise resolving to trend data
 */
async function fetchTrendData(dateRange, filters, granularity = 'daily') {
    console.log(`Fetching ${granularity} trend data from GA4...`);
    
    try {
        // In a real implementation, this would use the GA4 API to fetch actual data
        // For demonstration, we'll simulate an API call with a delay
        await new Promise(resolve => setTimeout(resolve, 700));
        
        // This would be replaced with actual GA4 data
        // The structure would match what's needed for the trend chart
        return {
            labels: ['1 Jun', '2 Jun', '3 Jun', '4 Jun', '5 Jun', '6 Jun', '7 Jun', 
                    '8 Jun', '9 Jun', '10 Jun', '11 Jun', '12 Jun', '13 Jun', '14 Jun'],
            data: [65, 59, 80, 81, 56, 55, 40, 45, 60, 75, 85, 90, 88, 79]
        };
    } catch (error) {
        console.error('Error fetching trend data:', error);
        throw error;
    }
}

/**
 * Fetch product performance data from GA4
 * @param {Object} dateRange Date range object with startDate and endDate
 * @param {Object} filters Additional filters to apply
 * @returns {Promise} Promise resolving to product performance data
 */
async function fetchProductPerformanceData(dateRange, filters) {
    console.log('Fetching product performance data from GA4...');
    
    try {
        // In a real implementation, this would use the GA4 API to fetch actual data
        // For demonstration, we'll simulate an API call with a delay
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // This would be replaced with actual GA4 data
        return {
            products: [
                {
                    name: 'Super AI Assistant',
                    category: 'AI & Software',
                    clicks: 356,
                    ctr: 4.8,
                    revenue: 1780000,
                    conversion: 5.2
                },
                {
                    name: 'Content Creator Pro',
                    category: 'AI & Software',
                    clicks: 289,
                    ctr: 3.9,
                    revenue: 1445000,
                    conversion: 4.8
                },
                {
                    name: 'Smart Watch Pro',
                    category: 'Elektronik',
                    clicks: 187,
                    ctr: 2.5,
                    revenue: 561000,
                    conversion: 3.2
                },
                {
                    name: 'Wireless Earbuds',
                    category: 'Elektronik',
                    clicks: 142,
                    ctr: 1.9,
                    revenue: 284000,
                    conversion: 2.1
                },
                {
                    name: 'Vitamin Kompleks',
                    category: 'Kesehatan',
                    clicks: 98,
                    ctr: 1.3,
                    revenue: 196000,
                    conversion: 2.0
                }
            ],
            totalProducts: 24
        };
    } catch (error) {
        console.error('Error fetching product performance data:', error);
        throw error;
    }
}

/**
 * Fetch traffic source data from GA4
 * @param {Object} dateRange Date range object with startDate and endDate
 * @param {Object} filters Additional filters to apply
 * @returns {Promise} Promise resolving to traffic source data
 */
async function fetchTrafficSourceData(dateRange, filters) {
    console.log('Fetching traffic source data from GA4...');
    
    try {
        // In a real implementation, this would use the GA4 API to fetch actual data
        // For demonstration, we'll simulate an API call with a delay
        await new Promise(resolve => setTimeout(resolve, 400));
        
        // This would be replaced with actual GA4 data
        return {
            sources: [
                { name: 'Sosial Media', percentage: 35 },
                { name: 'Organik', percentage: 25 },
                { name: 'Direct', percentage: 20 },
                { name: 'Referral', percentage: 15 },
                { name: 'Email', percentage: 5 }
            ]
        };
    } catch (error) {
        console.error('Error fetching traffic source data:', error);
        throw error;
    }
}

/**
 * Fetch demographics data from GA4
 * @param {Object} dateRange Date range object with startDate and endDate
 * @param {Object} filters Additional filters to apply
 * @returns {Promise} Promise resolving to demographics data
 */
async function fetchDemographicsData(dateRange, filters) {
    console.log('Fetching demographics data from GA4...');
    
    try {
        // In a real implementation, this would use the GA4 API to fetch actual data
        // For demonstration, we'll simulate an API call with a delay
        await new Promise(resolve => setTimeout(resolve, 550));
        
        // This would be replaced with actual GA4 data
        return {
            age: {
                labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
                data: [15, 35, 25, 18, 7]
            },
            gender: {
                labels: ['Pria', 'Wanita', 'Tidak Diketahui'],
                data: [45, 48, 7]
            },
            device: {
                labels: ['Mobile', 'Desktop', 'Tablet'],
                data: [65, 30, 5]
            }
        };
    } catch (error) {
        console.error('Error fetching demographics data:', error);
        throw error;
    }
}

/**
 * Update summary cards with fetched data
 * @param {Object} data Summary data object
 */
function updateSummaryCards(data) {
    // Update total clicks
    updateCardValue('TOTAL KLIK AFILIASI', data.totalClicks, `${data.clickGrowth > 0 ? '+' : ''}${data.clickGrowth}% dari bulan lalu`, data.clickGrowth >= 0);
    
    // Update estimated revenue
    updateCardValue('ESTIMASI PENDAPATAN', `Rp ${formatNumber(data.estimatedRevenue / 1000)}jt`, `${data.revenueGrowth > 0 ? '+' : ''}${data.revenueGrowth}% dari bulan lalu`, data.revenueGrowth >= 0);
    
    // Update active products
    updateCardValue('PRODUK AKTIF', data.activeProducts, `${data.newProducts} produk baru bulan ini`, true);
    
    // Update average CTR
    updateCardValue('RATA-RATA CTR', `${data.averageCTR}%`, `${data.ctrGrowth > 0 ? '+' : ''}${data.ctrGrowth}% dari bulan lalu`, data.ctrGrowth >= 0);
}

/**
 * Update a summary card with new values
 * @param {string} cardTitle Title of the card to update
 * @param {string|number} value Main value to display
 * @param {string} subtext Subtext to display
 * @param {boolean} isPositive Whether the trend is positive
 */
function updateCardValue(cardTitle, value, subtext, isPositive) {
    // Find the card by its title
    const cards = document.querySelectorAll('.card-title');
    let targetCard = null;
    
    for (const card of cards) {
        if (card.textContent.trim() === cardTitle) {
            targetCard = card.parentElement;
            break;
        }
    }
    
    if (targetCard) {
        // Update the value
        const valueElement = targetCard.querySelector('.card-value');
        if (valueElement) {
            valueElement.textContent = value;
        }
        
        // Update the subtext
        const subtextElement = targetCard.querySelector('.small');
        if (subtextElement) {
            subtextElement.textContent = subtext;
            subtextElement.className = `small ${isPositive ? 'text-success' : 'text-danger'}`;
            
            // Update the icon
            const iconElement = subtextElement.querySelector('i');
            if (iconElement) {
                iconElement.className = `bi ${isPositive ? 'bi-graph-up-arrow' : 'bi-graph-down-arrow'}`;
            } else {
                // Create icon if it doesn't exist
                const icon = document.createElement('i');
                icon.className = `bi ${isPositive ? 'bi-graph-up-arrow' : 'bi-graph-down-arrow'}`;
                subtextElement.prepend(icon, ' ');
            }
        }
    }
}

/**
 * Update trend chart with fetched data
 * @param {Object} data Trend data object
 */
function updateTrendChart(data) {
    const trendChart = Chart.getChart('trendChart');
    
    if (trendChart) {
        trendChart.data.labels = data.labels;
        trendChart.data.datasets[0].data = data.data;
        trendChart.update();
    }
}

/**
 * Update product performance chart with fetched data
 * @param {Object} data Product performance data object
 */
function updateProductPerformanceChart(data) {
    const productChart = Chart.getChart('productPerformanceChart');
    
    if (productChart && data.products) {
        productChart.data.labels = data.products.map(product => product.name);
        productChart.data.datasets[0].data = data.products.map(product => product.clicks);
        productChart.update();
    }
}

/**
 * Update traffic source chart with fetched data
 * @param {Object} data Traffic source data object
 */
function updateTrafficSourceChart(data) {
    const trafficChart = Chart.getChart('trafficSourceChart');
    
    if (trafficChart && data.sources) {
        trafficChart.data.labels = data.sources.map(source => source.name);
        trafficChart.data.datasets[0].data = data.sources.map(source => source.percentage);
        trafficChart.update();
    }
}

/**
 * Update demographics charts with fetched data
 * @param {Object} data Demographics data object
 */
function updateDemographicsCharts(data) {
    // Update age chart
    const ageChart = Chart.getChart('ageChart');
    if (ageChart && data.age) {
        ageChart.data.labels = data.age.labels;
        ageChart.data.datasets[0].data = data.age.data;
        ageChart.update();
    }
    
    // Update gender chart
    const genderChart = Chart.getChart('genderChart');
    if (genderChart && data.gender) {
        genderChart.data.labels = data.gender.labels;
        genderChart.data.datasets[0].data = data.gender.data;
        genderChart.update();
    }
    
    // Update device chart
    const deviceChart = Chart.getChart('deviceChart');
    if (deviceChart && data.device) {
        deviceChart.data.labels = data.device.labels;
        deviceChart.data.datasets[0].data = data.device.data;
        deviceChart.update();
    }
}

/**
 * Update product table with fetched data
 * @param {Object} data Product performance data object
 */
function updateProductTable(data) {
    if (!data.products) return;
    
    const tableBody = document.querySelector('.table-hover tbody');
    if (!tableBody) return;
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Add new rows
    data.products.forEach(product => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${product.name}</td>
            <td><span class="badge ${getBadgeClass(product.category)}">${product.category}</span></td>
            <td>${product.clicks}</td>
            <td>${product.ctr}%</td>
            <td>Rp ${formatNumber(product.revenue)}</td>
            <td>
                <div class="d-flex align-items-center">
                    <span class="me-2">${product.conversion}%</span>
                    <div class="progress flex-grow-1">
                        <div class="progress-bar" role="progressbar" style="width: ${product.conversion * 10}%" 
                            aria-valuenow="${product.conversion * 10}" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Update pagination info
    const paginationInfo = document.querySelector('.table-container .d-flex div');
    if (paginationInfo) {
        paginationInfo.textContent = `Menampilkan ${data.products.length} dari ${data.totalProducts} produk`;
    }
}

/**
 * Get appropriate badge class for product category
 * @param {string} category Product category
 * @returns {string} Bootstrap badge class
 */
function getBadgeClass(category) {
    switch (category) {
        case 'AI & Software':
            return 'bg-info';
        case 'Elektronik':
            return 'bg-warning';
        case 'Kesehatan':
            return 'bg-success';
        case 'Fashion':
            return 'bg-danger';
        default:
            return 'bg-secondary';
    }
}

/**
 * Format number with thousands separator
 * @param {number} number Number to format
 * @returns {string} Formatted number string
 */
function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Show a toast notification
 * @param {string} message Message to display
 * @param {string} type Type of toast (success, error, warning, info)
 */
function showToast(message, type = 'info') {
    // Check if toast container exists, create if not
    let toastContainer = document.querySelector('.toast-container');
    
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toastId = `toast-${Date.now()}`;
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${getToastBgClass(type)} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.setAttribute('id', toastId);
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Initialize and show toast
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove toast after it's hidden
    toast.addEventListener('hidden.bs.toast', function() {
        toast.remove();
    });
}

/**
 * Get appropriate background class for toast type
 * @param {string} type Toast type
 * @returns {string} Bootstrap background class
 */
function getToastBgClass(type) {
    switch (type) {
        case 'success':
            return 'success';
        case 'error':
            return 'danger';
        case 'warning':
            return 'warning';
        case 'info':
        default:
            return 'primary';
    }
}

// Initialize GA4 integration when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the analytics dashboard page
    if (document.getElementById('refreshData') && document.getElementById('trendChart')) {
        console.log('Analytics dashboard detected, initializing GA4 integration...');
        initGA4Integration();
    }
});
