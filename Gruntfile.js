module.exports = function( grunt ) {
    'use strict';

    var remapify = require( 'remapify' ),
        pkgInfo = grunt.file.readJSON( 'package.json' );

    require( 'matchdep' ).filterDev( 'grunt-*' ).forEach( grunt.loadNpmTasks );

    // Project configuration
    grunt.initConfig( {
        pkg: grunt.file.readJSON( 'package.json' ),

        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("dd-mm-yyyy") %> */',

		checktextdomain: {
			standard: {
				options:{
					text_domain: 'builder',
					correct_domain: true,
					keywords: [
						// WordPress keywords
						'__:1,2d',
						'_e:1,2d',
						'_x:1,2c,3d',
						'esc_html__:1,2d',
						'esc_html_e:1,2d',
						'esc_html_x:1,2c,3d',
						'esc_attr__:1,2d',
						'esc_attr_e:1,2d',
						'esc_attr_x:1,2c,3d',
						'_ex:1,2c,3d',
						'_n:1,2,4d',
						'_nx:1,2,4c,5d',
						'_n_noop:1,2,3d',
						'_nx_noop:1,2,3c,4d'
					]
				},
				files: [ {
					src: [
						'**/*.php',
						'!node_modules/**',
						'!build/**',
						'!tests/**',
						'!.github/**',
						'!vendor/**',
						'!*~'
					],
					expand: true
				} ]
			}
		},

        sass: {
            dist: {
                files: [ {
                    expand: true,
                    cwd: 'assets/dev/scss/direction',
                    src: '*.scss',
                    dest: 'assets/css',
                    ext: '.css'
                } ]
            }
        },

        browserify: {
            options: {
                browserifyOptions: {
                    debug: true
                },
                preBundleCB: function( bundle ) {
                    bundle.plugin( remapify, [
                        {
                            cwd: 'assets/dev/js/editor/behaviors',
                            src: '**/*.js',
                            expose: 'builder-behaviors'
                        },
                        {
                            cwd: 'assets/dev/js/editor/layouts',
                            src: '**/*.js',
                            expose: 'builder-layouts'
                        },
                        {
                            cwd: 'assets/dev/js/editor/models',
                            src: '**/*.js',
                            expose: 'builder-models'
                        },
                        {
                            cwd: 'assets/dev/js/editor/collections',
                            src: '**/*.js',
                            expose: 'builder-collections'
                        },
                        {
                            cwd: 'assets/dev/js/editor/views',
                            src: '**/*.js',
                            expose: 'builder-views'
                        },
                        {
                            cwd: 'assets/dev/js/editor/components',
                            src: '**/*.js',
                            expose: 'builder-components'
                        },
                        {
                            cwd: 'assets/dev/js/editor/utils',
                            src: '**/*.js',
                            expose: 'builder-utils'
                        },
                        {
                            cwd: 'assets/dev/js/editor/layouts/panel',
                            src: '**/*.js',
                            expose: 'builder-panel'
                        },
                        {
                            cwd: 'assets/dev/js/editor/components/template-library',
                            src: '**/*.js',
                            expose: 'builder-templates'
                        },
                        {
                            cwd: 'assets/dev/js/frontend',
                            src: '**/*.js',
                            expose: 'builder-frontend'
                        },
                        {
							cwd: 'assets/dev/js/editor/components/revisions',
							src: '**/*.js',
							expose: 'builder-revisions'
						}

                    ] );
                }
            },

            dist: {
                files: {
                    'assets/js/editor.js': [
                        'assets/dev/js/editor/utils/jquery-html5-dnd.js',
                        'assets/dev/js/editor/utils/jquery-serialize-object.js',
                        'assets/dev/js/editor/editor.js'
                    ],
                    'assets/js/admin.js': [ 'assets/dev/js/admin/admin.js' ],
                    'assets/js/admin-feedback.js': [ 'assets/dev/js/admin/admin-feedback.js' ],
                    'assets/js/frontend.js': [ 'assets/dev/js/frontend/frontend.js' ]

                },
                options: pkgInfo.browserify
            }

        },

        // Extract sourcemap to separate file
        exorcise: {
            bundle: {
                options: {},
                files: {
                    'assets/js/editor.js.map': [ 'assets/js/editor.js' ],
                    'assets/js/admin.js.map': [ 'assets/js/admin.js' ],
                    'assets/js/admin-feedback.js.map': [ 'assets/js/admin-feedback.js' ],
                    'assets/js/frontend.js.map': [ 'assets/js/frontend.js' ]
                }
            }
        },

        uglify: {
            //pkg: grunt.file.readJSON( 'package.json' ),
            options: {},
            dist: {
                files: {
                    'assets/js/editor.min.js': [
                        'assets/js/editor.js'
                    ],
                    'assets/js/admin.min.js': [
                        'assets/js/admin.js'
                    ],
                    'assets/js/admin-feedback.min.js': [
                        'assets/js/admin-feedback.js'
                    ],
                    'assets/js/frontend.min.js': [
                        'assets/js/frontend.js'
                    ]
                }
            }
        },

        usebanner: {
            dist: {
                options: {
                    banner: '<%= banner %>'
                },
                files: {
                    src: [
                        'assets/js/*.js',
                        'assets/css/*.css',

                        '!assets/css/animations.min.css'
                    ]
                }
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                'assets/js/dev/**/*.js'
            ]
        },

        postcss: {
            dev: {
                options: {
                    map: true,

                    processors: [
                        require( 'autoprefixer' )( {
                            browsers: 'last 2 versions, Safari > 5'
                        } )
                    ]
                },
                files: [ {
                    src: [
                        'assets/css/*.css',
                        '!assets/css/*.min.css'
                    ]
                } ]
            },
            minify: {
                options: {
                    processors: [
                        require( 'cssnano' )()
                    ]
                },
                files: [ {
                    expand: true,
                    src: [
                        'assets/css/*.css',
                        '!assets/css/*.min.css'
                    ],
                    ext: '.min.css'
                } ]
            }
        },

        watch:  {
            styles: {
                files: [
                    'assets/dev/scss/**/*.scss'
                ],
                tasks: [ 'styles' ]
            },

            scripts: {
                files: [
                    'assets/dev/js/**/*.js'
                ],
                tasks: [ 'scripts' ]
            }
        },

        wp_readme_to_markdown: {
            github: {
                options: {
                    wordpressPluginSlug: 'builder',
                    travisUrlRepo: 'https://travis-ci.org/FrankM1/builder',
                    gruntDependencyStatusUrl: 'https://david-dm.org/FrankM1/builder',
                    coverallsRepo: 'FrankM1/builder',
                    screenshot_url: 'assets/{screenshot}.png'
                },
                files: {
                    'README.md': 'readme.txt'
                }
            }
        },

        bumpup: {
            options: {
                updateProps: {
                    pkg: 'package.json'
                }
            },
            file: 'package.json'
        },

        replace: {
            plugin_main: {
                src: [ 'builder.php' ],
                overwrite: true,
                replacements: [
                    {
                        from: /Version: \d{1,1}\.\d{1,2}\.\d{1,2}/g,
                        to: 'Version: <%= pkg.version %>'
                    },
                    {
                        from: /BUILDER_VERSION', '.*?'/g,
                        to: 'BUILDER_VERSION\', \'<%= pkg.version %>\''
                    }
                ]
            },

            readme: {
                src: [ 'readme.txt' ],
                overwrite: true,
                replacements: [
                    {
                        from: /Stable tag: \d{1,1}\.\d{1,2}\.\d{1,2}/g,
                        to: 'Stable tag: <%= pkg.version %>'
                    }
                ]
            }
        },

        shell: {
            git_add_all: {
                command: [
                    'git add --all',
                    'git commit -m "Bump to <%= pkg.version %>"'
                ].join( '&&' )
            }
        },

        release: {
            options: {
                bump: false,
                npm: false,
                commit: false,
                tagName: 'v<%= version %>',
                commitMessage: 'released v<%= version %>',
                tagMessage: 'Tagged as v<%= version %>'
            }
        },

		copy: {
			main: {
				src: [
					'**',
					'!node_modules/**',
					'!build/**',
					'!bin/**',
					'!.git/**',
					'!tests/**',
					'!.github/**',
					'!.travis.yml',
					'!.jscsrc',
					'!.jshintignore',
					'!.jshintrc',
					'!ruleset.xml',
                    '!phpcs.ruleset.xml',
					'!README.md',
					'!phpunit.xml',
					'!Gruntfile.js',
                    '!gulp.js',
					'!package.json',
					'!npm-debug.log',
					'!composer.json',
					'!composer.lock',
					'!.gitignore',
					'!.gitmodules',
                    '!bower.json',
                    '!bower_components/**',
                    '!vendor/**',

                    '!assets/dev/**',
                    '!assets/**/*.map',
                    '!*~'
                ],
                expand: true,
                dest: 'build/'
            }
        },

        // make a zipfile
        compress: {
          main: {
            options: {
              archive: 'builder.zip'
            },
            files: [
                {
                    expand: true,
                    cwd: 'build/',
                    src: ['**'],
                    dest: 'builder/'
                } // makes all src relative to cwd
            ]
          }
        },

        clean: {
            //Clean up build folder
            main: [
                'build'
            ]
        }
    } );

    // Default task(s).
    grunt.registerTask( 'default', [
        'i18n',
        'scripts',
        'styles',
        'watch'
    ] );

    //Default task above without the watch task
    grunt.registerTask( 'compile-build', [
        'i18n',
        'scripts',
        'styles'
    ] );

    grunt.registerTask( 'i18n', [
        'checktextdomain'
    ] );

    grunt.registerTask( 'scripts', [
        'jshint',
        'browserify',
        'exorcise',
        'uglify'
    ] );

    grunt.registerTask( 'styles', [
        'sass',
        'postcss'
    ] );

    grunt.registerTask( 'build', [
        'compile-build',
        'usebanner',
        'clean',
        'copy',
        'compress',
        'default' // Remove banners for GitHub
    ] );

    grunt.registerTask( 'publish', [
        'compile-build',
        'bumpup',
        'replace',
        'shell:git_add_all',
        'release'
    ] );
};
