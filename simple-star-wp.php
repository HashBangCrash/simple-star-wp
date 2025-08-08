<?php
/**
 * Plugin Name: Simple Star WP
 * Description: A simple WordPress block and shortcode to render a 5-star rating system.
 * Version: 1.1.1
 * Author: Stephen Schrauger
 * Plugin URI: https://github.com/HashBangCrash/simple-star-wp
 * Github Plugin URI: HashBangCrash/simple-star-wp
 */

namespace hbc_simple_star_wp;


defined( 'ABSPATH' ) || exit;

// Enqueue styles for frontend and backend
function fsr_enqueue_styles() {
    wp_enqueue_style(
        'fsr-style',
        plugin_dir_url( __FILE__ ) . 'style.css',
        [],
        filemtime( plugin_dir_path( __FILE__ ) . 'style.css' )
    );
}
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\\fsr_enqueue_styles' );
add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\\fsr_enqueue_styles' );


// Register shortcode
function fsr_shortcode( $atts ) {
    $atts = shortcode_atts( [
        'rating'       => 2.5,
        'color'        => 'gold',
        'size'         => 24,
        'label_before' => '',
        'label_after'  => '',
        'label_font_size' => '',
        'label_before_font_size' => '',
        'label_after_font_size' => '',
    ], $atts );

    // Apply font size logic
    $before_font_size = esc_attr($atts['label_before_font_size'] ? $atts['label_before_font_size']: $atts['label_font_size']);
    $after_font_size  = esc_attr($atts['label_after_font_size'] ? $atts['label_after_font_size'] : $atts['label_font_size']);

    $rating       = floatval( $atts['rating'] );
    $rating       = max( 0, min( 5, round( $rating * 4 ) / 4 ) );
    $color        = sanitize_hex_color( $atts['color'] ) ?: $atts['color'];
    $size         = intval( $atts['size'] );
    $s_size       = esc_attr($size);
    $label_before = esc_html( $atts['label_before'] );
    $label_after  = esc_html( $atts['label_after'] );

    $output = '<div class="fsr-rating-wrapper">';

    if ( $label_before ) {
        $output .= "<span class='fsr-label-before' style='font-size: ${before_font_size}px' >${label_before}</span> ";
    }

    $output .= "<div class='fsr-rating' style='--fsr-color: ${color}; --fsr-size: ${s_size}px;' aria-label='Rating: ${rating} out of 5'>";

    for ( $i = 1; $i <= 5; $i++ ) {
        $diff = $rating - ( $i - 1 );
        $fill_pct = 0;

        if ( $diff >= 1 ) $fill_pct = 100;
        elseif ( $diff >= 0.75 ) $fill_pct = 65;
        elseif ( $diff >= 0.5 ) $fill_pct = 50;
        elseif ( $diff >= 0.25 ) $fill_pct = 38;

        $output .= fsr_svg_star( $fill_pct, $color, $size );
    }

    $output .= '</div>';

    if ( $label_after ) {
        $output .= " <span class='fsr-label-after' style='font-size: ${after_font_size}px' >${label_after}</span>";
    }

    $output .= '</div>';

    return $output;
}


function fsr_svg_star( $fill_pct, $color, $size ) {
    $clip_width = round($fill_pct / 100 * 24); // 24 is viewBox width
    $id = uniqid('fsr-');
    $s_color = esc_attr($color);
    $s_size = esc_attr($size);

    return "
    <svg class='fsr-star' width=${s_size} height=${s_size} viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' role='img' aria-label='star'>
        <defs>
            <clipPath id=${id}>
                <rect x='0' y='0' width='${clip_width}' height='24' />
            </clipPath>
        </defs>
        <!-- Background (empty star) -->
        <polygon fill='white' stroke='black' stroke-width='1'
            points='12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9' />
        <!-- Foreground (filled star) -->
        <polygon fill='${s_color}' stroke='black' stroke-width='1' clip-path='url(#${id})' 
            points='12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9' />
    </svg>";
}


add_shortcode( 'five-star-rating',  __NAMESPACE__ . '\\fsr_shortcode' );

// Register block
function fsr_register_block() {

    wp_register_script(
        'fsr-block',
        plugin_dir_url( __FILE__ ) . 'block.js',
        [ 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-server-side-render' ],
        filemtime( __FILE__ )
    );

    register_block_type( 'hbc-simple-star-wp/five-star-rating', [
        'editor_script'   => 'fsr-block',
        'render_callback' => __NAMESPACE__ . '\\fsr_render_block',
        'attributes'      => [
            'rating'       => ['type' => 'number', 'default' => 0],
            'color'        => ['type' => 'string', 'default' => 'gold'],
            'size'         => ['type' => 'number', 'default' => 24],
            'label_before' => ['type' => 'string', 'default' => ''],
            'label_after'  => ['type' => 'string', 'default' => ''],
            'label_font_size'=> [ 'type' => 'number',  'default' => 24 ],
            'label_before_font_size'=> [ 'type' => ['number', 'null'], 'default' => null ],
            'label_after_font_size' => [ 'type' => ['number', 'null'], 'default' => null ],
            'advanced_font_size'    => [ 'type' => 'boolean', 'default' => false ],
        ],
    ]
    );
}

add_action( 'init', __NAMESPACE__ . '\\fsr_register_block' );

function fsr_render_block( $attributes ) {
    return fsr_shortcode( $attributes );
}