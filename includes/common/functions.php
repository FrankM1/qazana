<?php

/**
 * Global loading indicator
 *
 * @return
 */
function qazana_loading_indicator() {

        $html = '<div class="qazana-loader-wrapper">';

            $html .= '<div class="qazana-loader">';
                $html .= '<div class="cubes">';
                    $html .= '<div class="cube cube-1"></div>';
                    $html .= '<div class="cube cube-2"></div>';
                    $html .= '<div class="cube cube-3"></div>';
                    $html .= '<div class="cube cube-4"></div>';
                    $html .= '<div class="cube cube-5"></div>';
                    $html .= '<div class="cube cube-6"></div>';
                    $html .= '<div class="cube cube-7"></div>';
                    $html .= '<div class="cube cube-8"></div>';
                    $html .= '<div class="cube cube-9"></div>';
                $html .= '</div>';
            $html .= '</div>';

            $html .= '<div class="qazana-loading-title">';
                $html .= '<div class="loading-text">';
                    $html .= '<span class="loading-text-words">L</span>';
                    $html .= '<span class="loading-text-words">O</span>';
                    $html .= '<span class="loading-text-words">A</span>';
                    $html .= '<span class="loading-text-words">D</span>';
                    $html .= '<span class="loading-text-words">I</span>';
                    $html .= '<span class="loading-text-words">N</span>';
                    $html .= '<span class="loading-text-words">G</span>';
                $html .= '</div>';
            $html .= '</div>';

        $html .= '</div>';

    return $html;

}

/**
 * [qazana_maybe_ssl_url description]
 * @param  [type] $url [description]
 * @return [type]      [description]
 */
function qazana_maybe_ssl_url( $url ) {

   if ( is_ssl() ) {
       $url = str_replace('http://', 'https://', $url );
	}

    return esc_url( $url );
}

/**
 * Rename array keys
 *
 * @param  [type]  $subject   [description]
 * @param  [type]  $newKey    [description]
 * @param  [type]  $oldKey    [description]
 * @param  boolean $recursive [description]
 * @return [type]             [description]
 */
function qazana_replace_array_key($subject, $newKey, $oldKey, $recursive = false ) {

    // if the value is not an array, then you have reached the deepest
    // point of the branch, so return the value
    if ( ! is_array( $subject ) ) return $subject;

    $newArray = array(); // empty array to hold copy of subject

    foreach ($subject as $key => $value) {

        // replace the key with the new key only if it is the old key
        $key = ($key == $oldKey) ? $newKey : $key;

        // add the value with the recursive call

        if ( $recursive ) {
            $newArray[$key] = qazana_replace_array_key($value, $newKey, $oldKey);
        } else {
            $newArray[$key] = $value;
        }
    }
    return $newArray;
}
