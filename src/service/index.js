'use strict';

import {execSql} from '../common/database';
import {SQL_INIT_ARENA} from './arena';
import {SQL_INIT_LACKS} from './lacks';

execSql(SQL_INIT_ARENA, []);
execSql(SQL_INIT_LACKS, []);
