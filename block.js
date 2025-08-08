const { registerBlockType } = wp.blocks;
const { InspectorControls } = wp.blockEditor || wp.editor;
const { PanelBody, RangeControl, ColorPicker, TextControl, ToggleControl } = wp.components;
const { createElement, Fragment } = wp.element;
const ServerSideRender = wp.serverSideRender;
const { RichText } = wp.blockEditor || wp.editor;


registerBlockType('hbc-simple-star-wp/five-star-rating', {
    title: 'Five Star Rating',
    icon: 'star-filled',
    category: 'widgets',
    attributes: {
        rating: { type: 'number', default: 0 },
        color: { type: 'string', default: 'gold' },
        size: { type: 'number', default: 24 },
        label_before: { type: 'string', default: '' },
        label_after: { type: 'string', default: '' },
        label_font_size: { type: 'number', default: 24 },
        label_before_font_size: { type: 'number', default: 24 },
        label_after_font_size: { type: 'number', default: 24 },
        advanced_font_size: { type: 'boolean', default: false }
    },
    edit({ attributes, setAttributes }) {
        return createElement(
            Fragment,
            null,
            createElement(InspectorControls, null,
                createElement(PanelBody, { title: 'Rating Settings' },
                    createElement(RangeControl, {
                        label: 'Rating',
                        value: attributes.rating,
                        onChange: (value) => setAttributes({ rating: value }),
                        min: 0,
                        max: 5,
                        step: 0.25,
                    }),
                    createElement(RangeControl, {
                        label: 'Star Size (px)',
                        value: attributes.size,
                        onChange: (value) => setAttributes({ size: value }),
                        min: 10,
                        max: 100,
                    }),
                    createElement(ColorPicker, {
                        color: attributes.color,
                        onChangeComplete: (color) => setAttributes({ color: color.hex }),
                        disableAlpha: true,
                    }),
                    createElement(TextControl, {
                        label: 'Label Before',
                        value: attributes.label_before,
                        onChange: (value) => setAttributes({ label_before: value }),
                    }),
                    createElement(TextControl, {
                        label: 'Label After',
                        value: attributes.label_after,
                        onChange: (value) => setAttributes({ label_after: value }),
                    }),
                    createElement(ToggleControl, {
                        label: 'Use separate label font sizes',
                        checked: attributes.advanced_font_size,
                        onChange: (value) => {
                            if (!value) {
                                // Reset advanced sizes to simple size when switching back
                                setAttributes({
                                    label_before_font_size: attributes.label_font_size,
                                    label_after_font_size: attributes.label_font_size
                                });
                            }
                            setAttributes({ advanced_font_size: value });
                        },
                    }),
                    (!attributes.advanced_font_size) &&
                    createElement(RangeControl, {
                        label: 'Label font size (px)',
                        value: attributes.label_font_size,
                        onChange: (value) => {
                            setAttributes({
                                label_font_size: value,
                                label_before_font_size: value,
                                label_after_font_size: value
                            });
                        },
                        min: 8,
                        max: 72,
                    }),
                    attributes.advanced_font_size &&
                    createElement(Fragment, null,
                        createElement(RangeControl, {
                            label: 'Label Before font size (px)',
                            value: attributes.label_before_font_size,
                            onChange: (value) => setAttributes({ label_before_font_size: value }),
                            min: 8,
                            max: 72,
                        }),
                        createElement(RangeControl, {
                            label: 'Label After font size (px)',
                            value: attributes.label_after_font_size,
                            onChange: (value) => setAttributes({ label_after_font_size: value }),
                            min: 8,
                            max: 72,
                        })
                    ),
                ),
            ),
            createElement('div', { className: 'fsr-rating' },
                createElement(ServerSideRender, {
                    block: 'hbc-simple-star-wp/five-star-rating',
                    attributes
                })
            )
        );
    },
    save() {
        return null; // server-side rendered
    }
});
