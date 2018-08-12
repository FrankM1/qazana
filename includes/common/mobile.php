<?php
/**
 * Radium Framework Core - A WordPress theme development framework.
 *
 * This file is a part of the RadiumFramework core.
 * Please be extremely cautious editing this file,
 *
 * @category RadiumFramework
 * @package  MetroCorp WP
 * @author   Franklin M Gitonga
 * @link     https://qazana.net/
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) { exit; }

/***************************************************************
* function qazana_is_iphone
* Detect the iPhone
***************************************************************/

function qazana_is_iphone() {
    return qazana()->mobile_detect->isIphone();
}

/***************************************************************
* function qazana_is_ipad
* Detect the iPad
***************************************************************/

function qazana_is_ipad() {
    return qazana()->mobile_detect->isIpad();
}

/***************************************************************
* function qazana_is_ipod
* Detect the iPod, most likely the iPod touch
***************************************************************/

function qazana_is_ipod() {
    return qazana()->mobile_detect->is( 'iPod' );
}

/***************************************************************
* function qazana_is_android
* Detect an android device.
***************************************************************/

function qazana_is_android() {
    return qazana()->mobile_detect->isAndroidOS();
}

/***************************************************************
* function qazana_is_blackberry
* Detect a blackberry device
***************************************************************/

function qazana_is_blackberry() {
    return qazana()->mobile_detect->isBlackBerry();
}

/***************************************************************
* function qazana_is_opera_mobile
* Detect both Opera Mini and hopefully Opera Mobile as well
***************************************************************/

function qazana_is_opera_mobile() {
    return qazana()->mobile_detect->isOpera();
}

/***************************************************************
* function qazana_is_webos
* Detect a webOS device such as Pre and Pixi
***************************************************************/

function qazana_is_webos() {
    return qazana()->mobile_detect->is( 'webOS' );
}

/***************************************************************
* function qazana_is_symbian
* Detect a symbian device, most likely a nokia smartphone
***************************************************************/

function qazana_is_symbian() {
    return qazana()->mobile_detect->is( 'Symbian' );
}

/***************************************************************
* function qazana_is_windows_mobile
* Detect a windows smartphone
***************************************************************/

function qazana_is_windows_mobile() {
    return qazana()->mobile_detect->is( 'WindowsMobileOS' ) || qazana()->mobile_detect->is( 'WindowsPhoneOS' );
}

/***************************************************************
* function qazana_is_motorola
* Detect a Motorola phone
***************************************************************/

function qazana_is_motorola() {
    return qazana()->mobile_detect->is( 'Motorola' );
}

/***************************************************************
* function qazana_is_samsung
* Detect a Samsung phone
***************************************************************/

function qazana_is_samsung() {
    return qazana()->mobile_detect->is( 'Samsung' );
}

/***************************************************************
* function qazana_is_samsung_tablet
* Detect the Galaxy tab
***************************************************************/

function qazana_is_samsung_tablet() {
    return qazana()->mobile_detect->is( 'SamsungTablet' );
}

/***************************************************************
* function qazana_is_kindle
* Detect an Amazon kindle
***************************************************************/

function qazana_is_kindle() {
    return qazana()->mobile_detect->is( 'Kindle' );
}

/***************************************************************
* function qazana_is_sony_ericsson
* Detect a Sony Ericsson
***************************************************************/

function qazana_is_sony_ericsson() {
    return qazana()->mobile_detect->is( 'Sony' );
}

/***************************************************************
* function qazana_is_smartphone
* Grade of phone A = Smartphone - currently testing this
***************************************************************/

function qazana_is_smartphone() {
    $grade = qazana()->mobile_detect->mobileGrade();
    if ( $grade == 'A' || $grade == 'B' ) {
        return true;
    } else {
        return false;
    }
}

/***************************************************************
* function qazana_is_handheld
* Wrapper function for detecting ANY handheld device
***************************************************************/

function qazana_is_handheld() {
    return qazana_is_mobile() || qazana_is_iphone() || qazana_is_ipad() || qazana_is_ipod() || qazana_is_android() || qazana_is_blackberry() || qazana_is_opera_mobile() || qazana_is_webos() || qazana_is_symbian() || qazana_is_windows_mobile() || qazana_is_motorola() || qazana_is_samsung() || qazana_is_samsung_tablet() || qazana_is_sony_ericsson() || qazana_is_nintendo();
}

/***************************************************************
* function qazana_is_mobile
* For detecting ANY mobile phone device
***************************************************************/

function qazana_is_mobile() {
    if ( qazana_is_tablet() ) return false;
    return qazana()->mobile_detect->isMobile();
}

/***************************************************************
* function qazana_is_ios
* For detecting ANY iOS/Apple device
***************************************************************/

function qazana_is_ios() {
    return qazana()->mobile_detect->isiOS();
}

/***************************************************************
* function qazana_is_tablet
* For detecting tablet devices (needs work)
***************************************************************/

function qazana_is_tablet() {
    return qazana()->mobile_detect->isTablet();
}
