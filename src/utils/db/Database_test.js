/**
 * @fileoverview Database tests.
 *
 * @license Copyright 2020 The Coding with Chrome Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author mbordihn@google.com (Markus Bordihn)
 */
import { Database } from './Database';

describe('Database', function() {
  it('constructor', function() {
    const db = new Database('test');
    expect(typeof db).toEqual('object');
  });

  it('.setObjectStoreName', function() {
    const db = new Database('test').setObjectStoreName('__test__');
    expect(db.getObjectStoreName()).toEqual('__test__');
  });

  it('.open', function(done) {
    const db = new Database('test_open');
    db.open().then(result => {
      expect(typeof result).toEqual('object');
      done();
    });
  });

  it('.add', function(done) {
    const db = new Database('test_add');
    db.open().then(() => {
      db.add('test', 1234).then(() => {
        done();
      });
    });
  });
});
