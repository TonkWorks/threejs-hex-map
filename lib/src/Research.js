define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Technologies = void 0;
    exports.centerOnNode = centerOnNode;
    exports.RenderTechTree = RenderTechTree;
    exports.AIChooseResearch = AIChooseResearch;
    exports.BenefitCompact = BenefitCompact;
    exports.DisplayResearchFinished = DisplayResearchFinished;
    exports.Technologies = new Map([
        ['agriculture', { id: 'agriculture', name: 'Agriculture', dependencies: [], population_growth_multiplier: 20, quote_audio: "/sounds/research/llm.mp3", quote: "Agriculture is the art of persuading the soil to produce plants; if it resists, apply more manure.", image: "../../assets/research/agriculture.webp" }],
        ['pottery', { id: 'pottery', name: 'Pottery', dependencies: ['agriculture'], population_growth_multiplier: 20, quote: "Agriculture is the art of persuading the soil to produce plants; if it resists, apply more manure.", image: "../../assets/research/agriculture.webp" }],
        ['writing', { id: 'writing', name: 'Writing', dependencies: ['pottery'], population_growth_multiplier: 20, quote: "Writing: because history isn't going to exaggerate itself!", image: "../../assets/research/embassy.webp" }],
        ['mathematics', { id: 'mathematics', name: 'Mathematics', dependencies: ['iron_working',], gold_growth_multiplier: 20, quote: "Mathematics: where numbers go to have a party and leave their logic behind.", image: "../../assets/research/mining.webp" }],
        ['engineering', { id: 'engineering', name: 'Engineering', dependencies: ['writing', 'mathematics'], quote: "Engineering: the art of fixing problems you didn't know you had, in ways you don't understand.", image: "../../assets/research/mining.webp" }],
        ['mining', { id: 'mining', name: 'Mining', dependencies: [], gold_growth_multiplier: 20, quote: "Mining: giving rocks a chance to see the sun, one explosion at a time.", image: "../../assets/research/mining.webp" }],
        ['iron_working', { id: 'iron_working', name: 'Iron Working', dependencies: ['mining'], gold_growth_multiplier: 20, quote: "Iron Working: because stabbing someone with a bronze sword was so last millennium.", image: "../../assets/research/mining.webp" }],
        ['rifles', { id: 'rifles', name: 'Rifle Upgrades', dependencies: [], quote: "Rifles: because sometimes you just need to reach out and touch someone.", image: "../../assets/research/rifles.webp" }],
        ['infantry', { id: 'infantry', name: 'Infrantry', dependencies: ["rifles"], unlocks: ["infantry"], quote: "Infantry: because sometimes you just need to take the fight to the ground.", image: "../../assets/research/rifles.webp" }],
        ['warships', { id: 'warships', name: 'Warships', dependencies: [], unlocks: ["warship"], quote: "Warship: because sometimes you just need to take the fight to the sea.", image: "../../assets/research/warship.webp" }],
        ['tractors', { id: 'tractors', name: 'Tractors', dependencies: ["engineering"], population_growth_multiplier: 40, quote: "Tractors: because sometimes you just need to take the fight to the farm.", image: "../../assets/research/tractors.webp" }],
        ['rail_roads', { id: 'rail_roads', name: 'Railroads', dependencies: ["engineering"], gold_growth_multiplier: 40, quote: "Railroads: choochoo", image: "../../assets/research/railroads.webp" }],
        ['blimps', { id: 'blimps', name: 'Blimps', dependencies: ["engineering"], quote: "Blimps: because sometimes you just need to take the fight to the sky.", image: "../../assets/research/blimps.webp" }],
        ['destroyer', { id: 'destroyer', name: 'Destroyers', dependencies: ['warships', 'engineering'], unlocks: ["destoyer"], quote: "Destroyer: because sometimes you just need to take the fight to the sea.", image: "../../assets/research/destroyer.webp" }],
        ['tank', { id: 'tank', name: 'Tanks', dependencies: ['engineering'], unlocks: ["tank"], quote: "Tanks: because walking into battle is so last century.", image: "../../assets/research/tank.webp" }],
        ['nuke', { id: 'nuke', name: 'Nukes', dependencies: ['engineering'], unlocks: ["missile"], quote: "Nuke: because sometimes you just need to take the fight to the sea.", image: "../../assets/research/nuke.webp" }],
        ['gmos', { id: 'tractors', name: 'GMOs', dependencies: ["tractors"], population_growth_multiplier: 40, quote: "Tractors: because sometimes you just need to take the fight to the farm.", image: "../../assets/research/tractors.webp" }],
        ['planes', { id: 'tractors', name: 'Planes', dependencies: ["rail_roads"], gold_growth_multiplier: 40, quote: "Tractors: because sometimes you just need to take the fight to the farm.", image: "../../assets/research/tractors.webp" }],
        ['gunships', { id: 'gunships', name: 'Gunships', dependencies: ["blimps"], unlocks: ["gunship"], quote: "Gunships: because sometimes you just need to take the fight to the sky.", image: "../../assets/research/gunship.webp" }],
    ]);
    const techTree = {
        technologies: exports.Technologies,
        playerTechs: {},
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
            const verticalStart = (window.innerHeight * 0.1);
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
            if (tech.id in researchedTechs) {
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
            </br>
            <strong>${tech.name}</strong>
            <p class="research_benefit_compact">${BenefitCompact(tech)}</p>
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
    function canUnlock(tech) {
        return tech.dependencies.every(d => d in techTree.playerTechs) &&
            !(tech.id in techTree.playerTechs);
    }
    function AIChooseResearch() {
        const techs = Array.from(techTree.technologies.values());
        const unlockedTechs = techs.filter(t => canUnlock(t));
        return unlockedTechs[Math.floor(Math.random() * unlockedTechs.length)];
    }
    function BenefitCompact(tech) {
        let benefit = "";
        if (tech.population_growth_multiplier) {
            let pop_icon = `<img src="../../assets/ui/resources/population.png" style="height: 35px; padding-right: 10px;"/>`;
            benefit += `${pop_icon} +${tech.population_growth_multiplier}%`;
        }
        if (tech.gold_growth_multiplier) {
            let gold_icon = `<img src="../../assets/ui/resources/gold.png" style="height: 35px; padding-right: 10px;"/>`;
            benefit += `${gold_icon} +${tech.gold_growth_multiplier}%`;
        }
        if (tech.unlocks) {
            for (let i = 0; i < tech.unlocks.length; i++) {
                let t = tech.unlocks[i];
                t = t.charAt(0).toUpperCase() + t.slice(1); // captialize
                benefit += `Unlocks: ${t}`;
            }
        }
        return benefit;
    }
    function DisplayResearchFinished(tech) {
        let benefit = "";
        if (tech.population_growth_multiplier) {
            let pop_icon = `<img src="../../assets/ui/resources/population.png" style="height: 35px;"/>`;
            benefit += `${pop_icon} +${tech.population_growth_multiplier}% population growth in all cities.`;
        }
        if (tech.gold_growth_multiplier) {
            let gold_icon = `<img src="../../assets/ui/resources/gold.png" style="height: 35px;"/>`;
            benefit += `${gold_icon} +${tech.gold_growth_multiplier}% gold production in all cities.`;
        }
        if (tech.unlocks) {
            for (let i = 0; i < tech.unlocks.length; i++) {
                let t = tech.unlocks[i];
                t = t.charAt(0).toUpperCase() + t.slice(1); // captialize
                benefit += `Unlocks: ${t}`;
            }
        }
        let research = `<span class="research highlight-hover action small">Pick a new research</action>`;
        let info = `
        <button class="close-button" onclick="CloseMenu();">&times;</button>
        <h3>Research Completed: ${tech.name}</h3>
        <p style="quote">${tech.quote}</p>
        <div style="text-align: center;">
            <img id="menu-research-img" src="${tech.image}">
        </div>
        <div>
            <h5>Benefits:</br>
                ${benefit}
            </h5>
        </div>
        ${research}
        
    `;
        return info;
    }
});
//# sourceMappingURL=Research.js.map