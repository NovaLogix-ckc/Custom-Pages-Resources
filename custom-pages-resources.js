/* Colin Kelly-Cook
 * Custom Pages Presentation
 * 2024-11-19
 * custom-pages-resources.js
 */

var customPages = customPages || {};

customPages.Helper = {

    /**
     * Opens a custom page
     * @param {object} pageInput - The input object for the custom page
     * @param {object} navigationOptions - The navigation options for the custom page
     */
    runNavigateCustomPage: function (pageInput, navigationOptions) {
        try {
            Xrm.Navigation.navigateTo(pageInput, navigationOptions)
                .then(function () {
                    // Success callback
                    console.log("Custom page opened successfully");
                })
                .catch(function (error) {
                    // Error callback
                    console.error("Error opening custom page: " + error.message);
                    Xrm.Navigation.openAlertDialog({
                        text: "An error occurred while opening the custom page: " + error.message
                    });
                });
        } catch (e) {
            console.error("Error in CustomPages.LookupHelper.runNavigateCustomPage: " + e.message);
            Xrm.Navigation.openAlertDialog({
                text: "An error occurred: " + e.message
            });
        }
    },

    /**
     * Opens a custom page from a Command Bar Main Form
     * @param {string} customPageName - The unique name of the custom page to open
     * @param {string} pagePostion - The custom Page Position (inlineFull, sideDialog, modalDialog)
     * @param {number} width - Width of the custom pages in pixels
     * @param {string} widthUnit - Unit of the width (px, %)
     * @param {string} title - Title of the custom page
     */
    openBasicCustomPage: function (formContext, customPageName, pagePosition, width, widthUnit, title) {
        // Defaults
        width = width || 500;
        widthUnit = widthUnit || "px";
        pagePosition = pagePosition || "sideDialog";

        // Set Form Context Variables required for the custom page
        const recordId = formContext.data.entity.getId().replace(/[{}]/g, "");
        const entityName = formContext.data.entity.getEntityName();

        // Create and set navigation options
        let navigationOptions = {};
        switch (pagePosition) {
            case "inlineFull":
                navigationOptions = {
                    target: 1,
                };
                break;
            case "sideDialog":
                navigationOptions = {
                    target: 2,
                    position: 2,
                    width: { value: width, unit: widthUnit },
                    title: title
                };
                break;
            case "modalDialog":
                navigationOptions = {
                    target: 2,
                    position: 1,
                    width: { value: width, unit: widthUnit },
                    title: title
                };
                break;
        }

        var pageInput = {
            pageType: "custom",
            name: customPageName,
            entityName: entityName,
            recordId: recordId
        };

        this.runNavigateCustomPage(pageInput, navigationOptions);
    },

    /**
     * Opens a custom page from a grid
     * @param {string} customPageName - The unique name of the custom page to open
     * @param {array} selectedItems - The selected items from the grid
     */
    openFromGrid: function (customPageName, selectedItems) {
        if (selectedItems) {
            let pageInput = {
                pageType: "custom",
                name: customPageName,
                entityName: selectedItems[0].TypeName,
                recordId: selectedItems,
            };
            let navigationOptions = {
                target: 2,
                position: 2,
                width: { value: 500, unit: "px" },
                title: "Multiple Records"
            };
            this.runNavigateCustomPage(pageInput, navigationOptions);
        }
    }
};