define({
	"root": {
		"buttons": {
			"create": "Create",
			"edit": "Edit",
			"delete": "Delete",
			"download": "Download",
			"upload": "Upload",
			"cancel": "Cancel",
			"update": "Update",
			"save": "Save",
			"saveChanges": "Save SLD values",
			"reset": "Reset",
			"resetAll": "Reset SLD values",
			"ok": "OK",
			"continue": "Continue",
			"backToSLDlist": "Back to SLDlist",
			"searchRule": "Search rule...",
			"wmspreview":"WMS Preview"

		},
		"common": {
			"SLD-editor": "SLD Editor",
			"SLDeditor-heading": "Symbolizer",
			"SLDtree-heading": "SLD Featuretypes",
			"Config-name": "SLD config name:",
			"SLDmap-heading": "Rule preview",
			"SLDtree-name": "name",
			"featuretype_id": "Featuretype id",
			"SLD-features-heading": "Features",
			"unit": "Unit",
			"foot": "Foot",
			"metre": "Metre",
			"pixel": "Pixel",
			"info-text": "Choose the symbolizer you want to edit from the menu on the left.",
			"saving" : "Saving...",
			"logout": "Sign out"
		},
		"sldtree": {
			"noRules": "No rules defined",
			"noSymbolizers": "No symbolizers defined"
		},
		"point": {
			"label": "Point",
			"advanced": "Point: Advanced",
			"symbol": "Symbol",
			"circle": "Circle",
			"cross": "Cross",
			"square": "Square",
			"star": "Star",
			"triangle": "Triangle",
			"x": "X",
			"external-graphic": "External graphic",
			"url": "URL",
			"size": "Size",
			"rotation": "Rotation",
			"opacity": "Opacity",
			"color": "Color"
		},
		"line": {
			"label": "Stroke",
			"advanced": "Stroke: Advanced",
			"line-join": "Line join",
			"join-miter": "Miter",
			"join-round": "Round",
			"join-bevel": "Bevel",
			"line-cap": "Line cap",
			"cap-butt": "Butt",
			"cap-round": "Round",
			"cap-square": "Square",
			"dasharray": "Dash array",
			"dasharray-length": "Dash length",
			"dasharray-space": "Dash space",
			"dash-offset": "Dash offset",
			"opacity": "Opacity",
			"color": "Color",
			"width": "Width"
		},
		"fill": {
			"label": "Fill",
			"advanced": "Fill: Advanced",
			"opacity": "Opacity",
			"color": "Color"
		},
		"text": {
			"label": "Text",
			"advanced": "Text: Advanced",
			"font": "Font",
			"style": "Style",
			"style-normal": "Normal",
			"style-italic": "Italic",
			"style-oblique": "Oblique",
			"weight": "Weight",
			"weight-normal": "Normal",
			"weight-bold": "Bold",
			"size": "Size",
			"color": "Color",
			"halo-color": "Halo color",
			"radius": "Halo radius",
			"pointplacement-anchorpointx": "X Anchor",
			"pointplacement-anchorpointy": "Y Anchor",
			"pointplacement-displacementx": "X Displ.",
			"pointplacement-displacementy": "Y Displ.",
			"pointplacement-rotation": "Rotation",
			"lineplacement-perpendicularoffset": "Perpendicular"

		},
		"preview": {
			"label": "Symbolizer preview"
		},
		"confirmNoSavemodal": {
			"label": "Are you sure you want to continue without saving?",
			"body": "You haven't saved your changes to the config. The changes will be lost without saving."
		},
		"confirmResetModel": {
			"title": "Are you sure you want to reset SLD config values?",
			"body": "Resetting the values will set the model the latest saved values. You will loose all the changes that are not saved."
		},
		"infoModal": {
			"modelSavedTitle": "Success!",
			"modelSavedBody": "New values saved successfully!",
			"errorWithSavingTitle": "Error!",
			"errorWithSavingBody": "Error with saving! The following error occured: "
		},
		"wmsPreview": {
			"title":"WMS Preview",
			"info":"The service must support EPSG:3857 and contain a layer corresponding to that defined in the SLD. Only changes made before the last save will be visible.",
			"wmsUrl": "Service URL",
			"username": "Username",
			"password": "Password"
		}
	}
});
