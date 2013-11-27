global.$ROOT_DIR = process.cwd();
global.$CFG_DIR = $ROOT_DIR + '/cfg';
global.$HDR_DIR = $ROOT_DIR + '/hdr';
global.$LOG_DIR = $ROOT_DIR + '/log';
global.$MOD_DIR = $ROOT_DIR + '/mod';
global.$SRC_DIR = $ROOT_DIR + (process.env.COVERAGE === '1' ? '/cov' : '/src');
global.DEFAULT_LANGUAGE = 'en_US';
require($HDR_DIR + '/events'); // Override process.emit to handle glob matching.