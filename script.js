function toggleISPInputs() {
    const ispCount = document.getElementById('isp-count').value;
    
    // Show or hide ISP input fields based on selected ISP count
    for (let i = 1; i <= 4; i++) {
        const ispInput = document.getElementById(`isp${i}`);
        const resultRow = document.getElementById(`result-wan${i}`);

        if (i <= ispCount) {
            ispInput.style.display = 'block';
            resultRow.style.display = 'table-row';
        } else {
            ispInput.style.display = 'none';
            resultRow.style.display = 'none';
        }
    }
}

function calculatePCC() {
    // Get the number of ISPs selected
    const ispCount = document.getElementById('isp-count').value;

    // Get input values for all WAN speeds, ensuring to parse them as floats for accuracy
    const wanSpeeds = [];
    for (let i = 1; i <= ispCount; i++) {
        wanSpeeds.push(parseFloat(document.getElementById(`wan${i}-speed`).value)); // Use parseFloat for decimal accuracy
    }

    // Find the best ratio (minimum speed among the selected ISPs)
    const bestRatio = Math.min(...wanSpeeds); // Best ratio should be the smallest value of the WAN speeds

    // Calculate numerators for each WAN with higher precision (no rounding to whole numbers)
    const numerators = wanSpeeds.map(wanSpeed => wanSpeed / bestRatio);

    // Update the table with results for each WAN, ensuring better precision for ratio and numerators
    for (let i = 1; i <= ispCount; i++) {
        document.getElementById(`wan${i}-speed-result`).innerText = `${wanSpeeds[i-1]} Mbps`;
        document.getElementById(`wan${i}-ratio`).innerText = bestRatio.toFixed(2); // Show best ratio with 2 decimal places
        document.getElementById(`wan${i}-numerator`).innerText = numerators[i-1].toFixed(4); // Show numerators with 4 decimal places for better precision
    }

    // Calculate Total Speed (accurate summation of speeds)
    const totalCalculate = wanSpeeds.reduce((acc, speed) => acc + speed, 0);
    document.getElementById('total-calculate').innerText = `${totalCalculate.toFixed(2)} Mbps`; // Show total with 2 decimal places

    // PCC Load Balancing Explanation
    const pccNote = new Array(ispCount).fill(bestRatio.toFixed(2)).join(' + '); // Display the best ratio in the explanation
    document.getElementById('pcc-note').innerText = `PCC Load Balancing: ${pccNote} = ${totalCalculate.toFixed(2)} Mbps`;

    // Calculate Denominators and Remainders (for each WAN)
    let connections = '';
    let remainders = '';
    for (let i = 1; i <= ispCount; i++) {
        const denominator = Math.floor(wanSpeeds[i-1] / bestRatio); // Floor for the denominator
        const remainder = wanSpeeds[i-1] % bestRatio; // Remainder calculation
        connections += `WAN-${i}:    ${denominator} `;
        remainders += `WAN-${i} Remainder: ${remainder} `;
    }

    // Update the connections and remainders in the result section
    document.getElementById('marking-connection').innerText = connections;
    document.getElementById('denominator-remainder').innerText = remainders;

    // Possible Speed Balance (total speed calculation)
    document.getElementById('possible-speed-balance').innerText = `${totalCalculate.toFixed(2)} Mbps`; // Ensure total speed balance shows with 2 decimal places
}

// Initialize to show inputs for 2 ISPs by default
window.onload = () => {
    toggleISPInputs();
};
