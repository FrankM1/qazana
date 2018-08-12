<?php
namespace Qazana\Testing;

use Qazana\Plugin;

class Qazana_Test_Base extends \WP_UnitTestCase {
	/**
	 * @var Local_Factory
	 */
	private static $local_factory;
	private static $qazana;

	public function __get( $name ) {
		switch ($name) {
			case 'factory':
				return self::factory();
				break;
			case 'qazana':
				return self::qazana();
				break;
		}
	}

	/**
	 * @return \Qazana\Testing\Local_Factory|\WP_UnitTest_Factory
	 */
	protected static function factory() {
		if ( ! self::$local_factory ) {
			self::$local_factory = Manager::$instance->get_local_factory();
		}

		return self::$local_factory;
	}

	/**
	 * @return \Qazana\Plugin
	 */
	protected static function qazana() {
		if ( ! self::$qazana ) {
			self::$qazana = Plugin::$instance;
		}

		return self::$qazana;
	}

	/**
	 * Asserts that an array have the specified keys.
	 *
	 * @param array $keys
	 * @param array|\ArrayAccess $array
	 * @param string $message
	 */
	protected function assertArrayHaveKeys( $keys, $array, $message = '' ) {
		if ( ! is_array( $keys ) ) {
			throw \PHPUnit_Util_InvalidArgumentHelper::factory(
				1,
				'only array'
			);
		}

		foreach ( $keys as $key ) {
			$this->assertArrayHasKey( $key, $array, $message );
		}

	}
}
