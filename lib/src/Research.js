define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Technologies = new Map([
        ['agriculture', { id: 'agriculture', name: 'Agriculture', dependencies: [] }],
        ['pottery', { id: 'pottery', name: 'Pottery', dependencies: ['agriculture'] }],
        ['mining', { id: 'mining', name: 'Mining', dependencies: ['agriculture'] }],
        ['writing', { id: 'writing', name: 'Writing', dependencies: ['pottery'] }],
        ['iron_working', { id: 'iron_working', name: 'Iron Working', dependencies: ['mining'] }],
        ['mathematics', { id: 'mathematics', name: 'Mathematics', dependencies: ['writing', 'iron_working'] }],
        ['engineering', { id: 'engineering', name: 'Engineering', dependencies: ['mathematics'] }],
        ['engineering2', { id: 'engineering2', name: 'Engineering2', dependencies: ['engineering'] }],
        ['engineering3', { id: 'engineering3', name: 'Engineering3', dependencies: ['engineering2'] }],
        ['engineering4', { id: 'engineering4', name: 'Engineering4', dependencies: ['engineering3'] }],
        ['engineering5', { id: 'engineering5', name: 'Engineering5', dependencies: ['engineering4'] }],
        ['engineering6', { id: 'engineering6', name: 'Engineering6', dependencies: ['engineering5'] }],
    ]);
    const techTree = {
        technologies: exports.Technologies,
        playerTechs: new Set()
    };
    const xSpacing = 300;
    const ySpacing = 200;
    const nodeWidth = 200;
    const nodeHeight = 125;
    let startX = 0;
    function calculateLayout() {
        function getDepth(tech) {
            if (tech.depth !== undefined)
                return tech.depth;
            if (tech.dependencies.length === 0)
                return tech.depth = 0;
            const depths = tech.dependencies.map(d => {
                const depTech = exports.Technologies.get(d);
                if (!depTech)
                    throw new Error(`Missing dependency: ${d}`);
                return getDepth(depTech);
            });
            return tech.depth = Math.max(...depths) + 1;
        }
        exports.Technologies.forEach(t => getDepth(t));
        const tiers = new Map();
        exports.Technologies.forEach(t => {
            if (t.depth === undefined)
                throw new Error(`Missing depth for technology: ${t.id}`);
            const tier = tiers.get(t.depth) || [];
            tier.push(t);
            tiers.set(t.depth, tier);
        });
        const maxTierHeight = Math.max(...Array.from(tiers.values()).map(t => t.length)) * ySpacing;
        Array.from(tiers.entries()).forEach(([depth, techs]) => {
            const x = 50 + (depth * xSpacing);
            const verticalStart = (window.innerHeight * 0.4) - ((techs.length * ySpacing) / 2);
            techs.forEach((tech, i) => {
                tech.x = x;
                tech.y = verticalStart + (i * ySpacing);
            });
        });
        return {
            width: (tiers.size * xSpacing) + 100,
            height: maxTierHeight + 100
        };
    }
    function centerOnNode(tech) {
        if (tech.x === undefined || tech.y === undefined)
            return;
        const container = document.getElementById('menu');
        if (!container)
            return;
        // Calculate the center position
        const centerX = tech.x + (nodeWidth / 2);
        // Calculate the scroll position
        const scrollX = centerX - (window.innerWidth / 2);
        // Smooth scroll to the position
        container.scrollTo({
            left: scrollX,
            behavior: 'smooth'
        });
    }
    exports.centerOnNode = centerOnNode;
    function setupDragScroll(container) {
        let isMouseDown = false;
        let scrollLeft;
        container.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
            container.style.cursor = 'grabbing';
        });
        container.addEventListener('mouseleave', () => {
            isMouseDown = false;
            container.style.cursor = 'default';
        });
        container.addEventListener('mouseup', () => {
            isMouseDown = false;
            container.style.cursor = 'default';
        });
        container.addEventListener('mousemove', (e) => {
            if (!isMouseDown)
                return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2;
            container.scrollLeft = scrollLeft - walk;
        });
    }
    function RenderTechTree(currentlyResearching, researchedTechs, onTechClick) {
        const container = document.getElementById('menu');
        if (!container)
            throw new Error('Container element not found');
        techTree.playerTechs = researchedTechs;
        // Set up container styles for horizontal scrolling
        container.style.position = 'absolute';
        container.style.overflowX = 'scroll'; // Show horizontal scrollbar
        container.style.userSelect = 'none'; // Prevent text selection while dragging
        container.style.cursor = 'grab'; // Show grab cursor
        container.innerHTML = '';
        const layout = calculateLayout();
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.width = `${layout.width}px`;
        wrapper.style.height = '100%';
        container.appendChild(wrapper);
        // Set up drag scrolling
        setupDragScroll(container);
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', layout.width.toString());
        svg.setAttribute('height', '100%');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.pointerEvents = 'none';
        // Add arrow marker definition
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        marker.setAttribute('id', 'arrow');
        marker.setAttribute('viewBox', '0 0 10 10');
        marker.setAttribute('refX', '9');
        marker.setAttribute('refY', '5');
        marker.setAttribute('markerWidth', '6');
        marker.setAttribute('markerHeight', '6');
        marker.setAttribute('orient', 'auto-start-reverse');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
        path.setAttribute('fill', '#666');
        marker.appendChild(path);
        defs.appendChild(marker);
        svg.appendChild(defs);
        // Draw connection lines
        exports.Technologies.forEach(tech => {
            if (tech.x === undefined || tech.y === undefined) {
                throw new Error(`Missing coordinates for technology: ${tech.id}`);
            }
            tech.dependencies.forEach(depId => {
                const depTech = exports.Technologies.get(depId);
                if (!depTech || depTech.x === undefined || depTech.y === undefined) {
                    throw new Error(`Invalid dependency: ${depId}`);
                }
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', (depTech.x + nodeWidth).toString());
                line.setAttribute('y1', (depTech.y + nodeHeight / 2).toString());
                line.setAttribute('x2', tech.x.toString());
                line.setAttribute('y2', (tech.y + nodeHeight / 2).toString());
                line.setAttribute('stroke', '#666');
                line.setAttribute('stroke-width', '2');
                line.setAttribute('marker-end', 'url(#arrow)');
                svg.appendChild(line);
            });
        });
        wrapper.appendChild(svg);
        // Create tech nodes
        exports.Technologies.forEach(tech => {
            if (tech.x === undefined || tech.y === undefined) {
                throw new Error(`Missing coordinates for technology: ${tech.id}`);
            }
            const techDiv = document.createElement('div');
            techDiv.className = 'tech-node';
            techDiv.style.position = 'absolute';
            techDiv.style.left = `${tech.x}px`;
            techDiv.style.top = `${tech.y}px`;
            techDiv.style.width = `${nodeWidth}px`;
            techDiv.style.height = `${nodeHeight}px`;
            // Update styling based on researched and currently researching tech
            if (researchedTechs.has(tech.id)) {
                techDiv.style.color = 'goldenrod';
                techDiv.style.backgroundColor = 'rgba(84, 18, 138, 0.75)';
            }
            else if (currentlyResearching === tech.id) {
                techDiv.style.color = 'white';
                techDiv.style.backgroundColor = 'rgba(0, 128, 0, 0.75)'; // Green for currently researching
            }
            else if (canUnlock(tech)) {
                techDiv.style.color = 'white';
                techDiv.style.backgroundColor = 'rgba(84, 18, 138, 0.75)';
            }
            else {
                techDiv.style.color = 'white';
                techDiv.style.backgroundColor = 'grey';
            }
            techDiv.innerHTML = `
        <div class="tech-content">
            <strong>${tech.name}</strong>
        </div>
        `;
            wrapper.appendChild(techDiv);
            techDiv.addEventListener('click', (e) => {
                // Prevent click from interfering with drag
                centerOnNode(tech);
                if (canUnlock(tech)) {
                    onTechClick(tech);
                }
            });
        });
        container.style.visibility = "visible";
    }
    exports.RenderTechTree = RenderTechTree;
    function canUnlock(tech) {
        return tech.dependencies.every(d => techTree.playerTechs.has(d)) &&
            !techTree.playerTechs.has(tech.id);
    }
});
//# sourceMappingURL=Research.js.map