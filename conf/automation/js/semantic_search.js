rules.JSRule({
    name: "Semantic Search Logic",
    description: "Reasoning engine for capability matching",
    triggers: [triggers.ItemStateUpdateTrigger('Search_Query')],
    execute: () => {
        // Беремо значення прямо з ітема, а не з event
        const queryItem = items.getItem("Search_Query");
        if (!queryItem || queryItem.state === "NULL") return;

        const query = queryItem.state.toString().toLowerCase().replace("search:", "").trim();
        console.info("Semantic Search: Searching for -> " + query);

        const allItems = items.getItems();
        let found = [];

        allItems.forEach(item => {
            const ssnMeta = item.getMetadata("ssn_sosa");
            const tags = item.tags ? item.tags.join(" ").toLowerCase() : "";
            
            // Співставлення
            if ((ssnMeta && ssnMeta.value.toLowerCase().includes(query)) || tags.includes(query)) {
                found.push(item.label);
            }
        });

        const resultText = found.length > 0 ? "Found: " + found.join(", ") : "Nothing found for " + query;
        
        // Записуємо результат
        items.getItem("Search_Results").postUpdate(resultText);
        console.info("Semantic Search: " + resultText);
    }
});