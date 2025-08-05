const { registerBlockType } = wp.blocks;
const { InspectorControls } = wp.blockEditor || wp.editor;
const { PanelBody, RangeControl, ColorPicker, TextControl } = wp.components;
const { createElement } = wp.element;
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
    },
    edit({ attributes, setAttributes }) {
        return createElement(
            'div',
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
                    })
                )
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
