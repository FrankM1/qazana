<?php
namespace Qazana\Testing;

trait Qazana_Test {

	private static $local_factory;
	private static $qazana;

	/**
	 * @return \WP_UnitTestCase
	 */
	abstract protected function getSelf();

	public function __get( $name ) {
		switch ( $name ) {
			case 'factory':
				return self::factory();
				break;
			case 'qazana':
				return self::qazana();
				break;
		}
	}

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
			self::$qazana = \Qazana\Plugin::instance();
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
	public function assertArrayHaveKeys( $keys, $array, $message = '' ) {
		if ( ! is_array( $keys ) ) {
			throw \PHPUnit_Util_InvalidArgumentHelper::factory(
				1,
				'only array'
			);
		}

		foreach ( $keys as $key ) {
			$this->getSelf()->assertArrayHasKey( $key, $array, $message );
		}
	}

	/**
	 * assert that an action has been registered for this hook.
	 *
	 * @param string $tag
	 * @param false|callable $function_to_check
	 */
	public function assertHasHook( $tag, $function_to_check = false ) {
		if ( ! is_string( $tag ) ) {
			throw \PHPUnit_Util_InvalidArgumentHelper::factory(
				1,
				'only string'
			);
		}

		if ( ! ( is_callable( $function_to_check ) || ( ! $function_to_check ) ) ) {
			throw \PHPUnit_Util_InvalidArgumentHelper::factory(
				1,
				'only callback of false'
			);
		}

		$this->getSelf()->assertNotFalse( has_filter( $tag, $function_to_check ) );
	}

	public function define_doing_ajax() {
		if ( ! \Qazana\Utils::is_ajax() ) {
			define( 'DOING_AJAX', true );
		}
	}
}
