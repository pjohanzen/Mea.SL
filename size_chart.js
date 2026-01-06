document.addEventListener('DOMContentLoaded', function() {
    const modifiers = {
        jacket: {
            length: 'regular',
            width: 'regular'
        },
        pants: {
            length: 'regular',
            width: 'regular'
        }
    };

    const multipliers = {
        'x-short': -2,
        'short': -1,
        'regular': 0,
        'tall': 1,
        'x-tall': 2,
        'skinny': -2,
        'slim': -1,
        'loose': 1,
        'x-loose': 2
    };

    const increments = {
        jacket: {
            length: 0.75,
            chest: 0.75,
            waist: 0.75,
            hip: 0.75,
            shoulder: 0.25,
            sleeve: 0.5,
            bicep: 0.5
        },
        pants: {
            waist: 0,
            hip: 1,
            rise: 0, // Not listed in increments, assuming 0
            thigh: 1,
            bottom: 0.75,
            length: 0.75
        }
    };

    // Map measurements to modifier types
    const measurementTypes = {
        jacket: {
            length: 'length',
            chest: 'width',
            waist: 'width',
            hip: 'width',
            shoulder: 'width',
            sleeve: 'length',
            bicep: 'width'
        },
        pants: {
            waist: 'width',
            hip: 'width',
            rise: 'length', // Usually rise is length-dependent? Or maybe width? Assuming length for now or 0 change.
            thigh: 'width',
            bottom: 'width',
            length: 'length'
        }
    };

    function updateTable(tableId, category) {
        const table = document.getElementById(tableId);
        if (!table) return;

        const rows = table.querySelectorAll('tbody tr[data-measurement]');
        rows.forEach(row => {
            const measurement = row.getAttribute('data-measurement');
            const baseValues = row.getAttribute('data-base-values').split(',').map(Number);
            const cells = row.querySelectorAll('td:not(:first-child)'); // Skip label cell

            const increment = increments[category][measurement] || 0;
            const modifierType = measurementTypes[category][measurement];
            
            let multiplier = 0;
            if (modifierType) {
                const selectedModifier = modifiers[category][modifierType];
                multiplier = multipliers[selectedModifier] || 0;
            }

            const adjustment = multiplier * increment;

            cells.forEach((cell, index) => {
                if (index < baseValues.length) {
                    let newValue = baseValues[index] + adjustment;
                    // Round to reasonable decimals (e.g. 2) to avoid floating point errors
                    // But keep .25, .5, .75 clean.
                    newValue = Math.round(newValue * 100) / 100;
                    cell.textContent = newValue;
                }
            });
        });
    }

    function updateAllTables() {
        updateTable('jacket-table', 'jacket');
        updateTable('pants-table', 'pants');
    }

    // Event listeners for modifier buttons
    document.querySelectorAll('.modifier-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            const value = this.getAttribute('data-value');
            
            // Determine category based on the section the button is in
            const section = this.closest('div[id$="-section"]');
            if (!section) return;
            
            const category = section.id.replace('-section', ''); // 'jacket' or 'pants'

            // Update state for specific category
            if (modifiers[category]) {
                modifiers[category][type] = value;
            }

            // Update UI for buttons of this type IN THIS SECTION only
            section.querySelectorAll(`.modifier-btn[data-type="${type}"]`).forEach(b => {
                if (b.getAttribute('data-value') === value) {
                    b.classList.remove('bg-white', 'text-mea-black');
                    b.classList.add('bg-mea-peach', 'text-white', 'active');
                } else {
                    b.classList.remove('bg-mea-peach', 'text-white', 'active');
                    b.classList.add('bg-white');
                }
            });

            // Update ONLY the relevant table
            updateTable(`${category}-table`, category);
        });
    });

    // Initial update (optional, but good to ensure consistency)
    updateAllTables();
});
