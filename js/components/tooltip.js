// Custom Reusable Tooltip Component
class CustomTooltip {
    constructor() {
        this.el = null;
        this.init();
    }

    init() {
        this.el = document.createElement("div");
        this.el.className = "custom-chart-tooltip opacity-0";
        document.body.appendChild(this.el);
    }

    show(content, x, y) {
        if (!this.el) return;
        this.el.innerHTML = content.replace(/\n/g, "<br>");
        this.el.classList.remove("opacity-0");
        this.el.classList.add("opacity-100");
        
        // Position tooltip centered above the target coordinates
        const width = this.el.clientWidth;
        const height = this.el.clientHeight;
        
        this.el.style.left = `${x - width / 2}px`;
        this.el.style.top = `${y - height - 10}px`;
    }

    hide() {
        if (!this.el) return;
        this.el.classList.remove("opacity-100");
        this.el.classList.add("opacity-0");
    }
}

// Export a single global instance
window.chartTooltip = new CustomTooltip();
