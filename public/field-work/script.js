// ==========================================================================
// SIH 2026 E-Waste Platform - Interactive Unit Economics Simulator
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    initEconomicsCalculator();
});

function initEconomicsCalculator() {
    const materialSelect = document.getElementById('materialSelect');
    const weightSlider = document.getElementById('weightSlider');
    const weightInput = document.getElementById('weightInput');

    // Return early if not on the unit economics calculator
    if (!materialSelect || !weightSlider || !weightInput) return;

    // Result fields
    const resInformal = document.getElementById('resInformal');
    const resFormal = document.getElementById('resFormal');
    const resGain = document.getElementById('resGain');
    const resFee = document.getElementById('resFee');

    function calculate() {
        const selectedOption = materialSelect.options[materialSelect.selectedIndex];
        const informalRate = parseFloat(selectedOption.getAttribute('data-informal')) || 0;
        const formalRate = parseFloat(selectedOption.getAttribute('data-formal')) || 0;
        
        let weight = parseFloat(weightInput.value) || 0;
        if (weight < 1) weight = 1;

        // Calculate Totals
        const totalInformal = Math.round(weight * informalRate);
        const totalFormal = Math.round(weight * formalRate);
        const netGain = totalFormal - totalInformal;
        const percentageGain = totalInformal > 0 ? ((netGain / totalInformal) * 100).toFixed(1) : 0;
        const platformFee = Math.round(totalFormal * 0.03); // 3% paid by Recycler

        // Update UI
        if (resInformal) resInformal.textContent = `₹${totalInformal.toLocaleString('en-IN')}`;
        if (resFormal) resFormal.textContent = `₹${totalFormal.toLocaleString('en-IN')}`;
        if (resGain) resGain.textContent = `+₹${netGain.toLocaleString('en-IN')} (+${percentageGain}%)`;
        if (resFee) resFee.textContent = `₹${platformFee.toLocaleString('en-IN')}`;
    }

    // Sync Slider and Input Box
    weightSlider.addEventListener('input', (e) => {
        weightInput.value = e.target.value;
        calculate();
    });

    weightInput.addEventListener('input', (e) => {
        weightSlider.value = e.target.value;
        calculate();
    });

    materialSelect.addEventListener('change', calculate);

    // Initial calculation on load
    calculate();
}
