# Simple Star WP

A simple WordPress plugin providing a five-star rating shortcode and block with customizable star ratings.

---

## Features

- Display a 5-star rating with fractional stars (rounded to quarter increments).
- Customize star size and color.
- Add optional text labels before and after the stars.
- Use as a shortcode or as a block in the WordPress block editor.
- Server-side rendered block with live preview in editor.

---

## Shortcode Usage

Use the shortcode `[five-star-rating]` anywhere in your posts or pages.

### Shortcode Syntax

`[five-star-rating rating="4.25" color="#FFD700" size="24" label_before="Rating:" label_after="out of 5"]`

### Shortcode Parameters

| Parameter      | Type    | Required | Default | Description                                                                |
|----------------|---------|----------|---------|----------------------------------------------------------------------------|
| `rating`       | decimal | No       | 0       | The star rating between 0 and 5 (supports quarters, e.g., 3.75).           |
| `color`        | string  | No       | gold    | Star fill color — accepts named colors or hex codes (e.g., `gold`, `#FFD700`). |
| `size`         | integer | No       | 24      | Star size in pixels.                                                        |
| `label_before` | string  | No       | ""      | Text displayed immediately before the stars.                              |
| `label_after`  | string  | No       | ""      | Text displayed immediately after the stars.                               |

---

