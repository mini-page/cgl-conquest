// Custom Reusable Dropdown Component
class CustomDropdown {
    constructor(selectElement) {
        this.select = selectElement;
        this.wrapper = null;
        this.button = null;
        this.panel = null;
        this.options = [];
        this.init();
    }

    init() {
        // Hide the original select
        this.select.style.setProperty("display", "none", "important");

        // Create wrapper
        this.wrapper = document.createElement("div");
        this.wrapper.className = "relative custom-dropdown-wrapper w-full";
        this.select.parentNode.insertBefore(this.wrapper, this.select);
        this.wrapper.appendChild(this.select);

        // Create button trigger
        this.button = document.createElement("button");
        this.button.type = "button";
        
        // Match style of original select
        const originalClasses = this.select.className;
        // Keep dimensions and basic padding, border classes
        this.button.className = "w-full text-left flex justify-between items-center bg-white/5 border border-black/10 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 dark:text-gray-300 outline-none focus:border-accentCyan cursor-pointer transition select-none";
        
        this.updateButtonText();
        this.wrapper.appendChild(this.button);

        // Create options panel
        this.panel = document.createElement("div");
        this.panel.className = "absolute left-0 w-full mt-1 bg-white dark:bg-[#151526] border border-black/10 dark:border-white/10 shadow-2xl z-50 rounded-lg p-1 max-h-48 overflow-y-auto hidden divide-y divide-black/5 dark:divide-white/5 scrollbar-thin";
        this.wrapper.appendChild(this.panel);

        // Render option items
        this.renderOptions();

        // Bind events
        this.button.addEventListener("click", (e) => {
            e.stopPropagation();
            this.toggle();
        });

        document.addEventListener("click", (e) => {
            if (this.panel && !this.wrapper.contains(e.target)) {
                this.close();
            }
        });

        // Listen for change events from external scripts/hotkeys
        this.select.addEventListener("change", () => {
            this.updateButtonText();
            this.renderOptions();
        });

        // Sync with form reset
        if (this.select.form) {
            this.select.form.addEventListener("reset", () => {
                setTimeout(() => {
                    this.refresh();
                }, 0);
            });
        }
    }

    updateButtonText() {
        const selectedOption = this.select.options[this.select.selectedIndex];
        const text = selectedOption ? selectedOption.text : "-- Select Option --";
        this.button.innerHTML = `<span>${text}</span><span class="text-[9px] opacity-60 ml-2">▼</span>`;
    }

    renderOptions() {
        this.panel.innerHTML = "";
        Array.from(this.select.options).forEach((opt, idx) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "w-full text-left px-2.5 py-1.5 rounded text-xs transition select-none flex items-center justify-between ";
            
            // Highlight selected option
            if (this.select.selectedIndex === idx) {
                btn.className += "bg-black/5 dark:bg-white/5 text-accentCyan font-bold";
            } else {
                btn.className += "text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5";
            }

            btn.innerHTML = `<span>${opt.text}</span>`;
            if (this.select.selectedIndex === idx) {
                btn.innerHTML += `<i class="fa-solid fa-check text-[10px] text-accentCyan"></i>`;
            }

            btn.onclick = (e) => {
                e.stopPropagation();
                this.select.selectedIndex = idx;
                this.select.dispatchEvent(new Event("change"));
                this.updateButtonText();
                this.renderOptions(); // Refresh highlights
                this.close();
            };

            this.panel.appendChild(btn);
        });
    }

    toggle() {
        // Close other dropdowns
        document.querySelectorAll(".custom-dropdown-wrapper div").forEach(el => {
            if (el !== this.panel) el.classList.add("hidden");
        });
        this.panel.classList.toggle("hidden");
    }

    close() {
        this.panel.classList.add("hidden");
    }

    // Refresh option list if underlying select options changed
    refresh() {
        this.updateButtonText();
        this.renderOptions();
    }
}

// Global initialization helper
window.initCustomDropdown = function(selectEl) {
    if (!selectEl) return null;
    // Check if already initialized to prevent duplicates
    if (selectEl.dataset.customDropdownInitialized) {
        const instance = selectEl.customDropdownInstance;
        if (instance) instance.refresh();
        return instance;
    }
    const instance = new CustomDropdown(selectEl);
    selectEl.customDropdownInstance = instance;
    selectEl.dataset.customDropdownInitialized = "true";
    return instance;
};

// Scan and upgrade all standard select elements on load
window.upgradeAllSelectDropdowns = function() {
    const selects = document.querySelectorAll("select:not(.hidden)");
    selects.forEach(select => {
        window.initCustomDropdown(select);
    });
};
