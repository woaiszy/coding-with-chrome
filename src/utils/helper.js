/**
 * @fileoverview Helper for the Coding with Chrome editor.
 *
 * This helper class provides shortcuts to get the implemented instances and
 * make sure that they have the correct type.
 *
 * @license Copyright 2015 Google Inc. All Rights Reserved.
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
goog.provide('cwc.utils.Helper');
goog.provide('cwc.utils.HelperInstances');

goog.require('cwc.config.Debug');
goog.require('cwc.config.Prefix');
goog.require('cwc.ui.Helper');
goog.require('cwc.utils.Features');
goog.require('cwc.utils.Logger');

goog.require('goog.html.SafeHtml');
goog.require('goog.ui.Dialog');


/**
 * @typedef {cwc.ui.Account|
 *   cwc.fileHandler.FileCreator|
 *   cwc.fileHandler.FileExporter|
 *   cwc.fileHandler.FileLoader|
 *   cwc.fileHandler.FileSaver|
 *   cwc.mode.Modder|
 *   cwc.protocol.Arduino.api|
 *   cwc.protocol.Serial.api|
 *   cwc.protocol.bluetooth.Api|
 *   cwc.protocol.ev3.Api|
 *   cwc.renderer.Renderer|
 *   cwc.ui.Blockly|
 *   cwc.ui.Config|
 *   cwc.ui.ConnectionManager|
 *   cwc.ui.Debug|
 *   cwc.ui.Documentation|
 *   cwc.ui.Editor|
 *   cwc.ui.File|
 *   cwc.ui.GDrive|
 *   cwc.ui.Gui|
 *   cwc.ui.Layout|
 *   cwc.ui.Library|
 *   cwc.ui.Menubar|
 *   cwc.ui.Message|
 *   cwc.ui.Navigation|
 *   cwc.ui.Preview|
 *   cwc.ui.Runner|
 *   cwc.ui.SelectScreen|
 *   cwc.ui.Statusbar|
 *   cwc.ui.Turtle|
 *   cwc.ui.Tutorial}
 */
cwc.utils.HelperInstance;



/**
 * Helper for all the ui parts and modules.
 * @constructor
 * @final
 * @export
 */
cwc.utils.Helper = function() {
  /** @type {!string} */
  this.name = 'Helper';

  /** @private {!cwc.utils.LogLevel} */
  this.loglevel_ = cwc.config.LogLevel;

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.loglevel_, this.name);

  /** @private {!cwc.utils.features} */
  this.features_ = new cwc.utils.Features(this.loglevel_);

  /** @private {string} */
  this.prefix_ = cwc.config.Prefix.GENERAL || '';

  /** @private {string} */
  this.cssPrefix_ = cwc.config.Prefix.CSS || '';

  /** @private {Object<string, cwc.utils.HelperInstance>} */
  this.instances_ = {};
};


/**
 * @param {!string} name
 * @param {!cwc.utils.HelperInstance} instance
 * @param {boolean=} opt_overwrite
 * @export
 */
cwc.utils.Helper.prototype.setInstance = function(name, instance,
    opt_overwrite) {
  if (this.instances_[name] && !opt_overwrite) {
    this.log_.error('Instance', name, ' already exists!');
  }
  this.log_.debug('Set', name, 'instance to', instance);
  this.instances_[name] = instance;
  if (typeof instance.setHelper == 'function') {
    instance.setHelper(this);
  }
};


/**
 * @param {!string} name
 * @param {boolean=} opt_required
 * @return {cwc.utils.HelperInstance}
 * @export
 */
cwc.utils.Helper.prototype.getInstance = function(name, opt_required) {
  var error = null;
  if (typeof this.instances_[name] == 'undefined') {
    error = 'Instance ' + name + ' is not defined!';
    this.log_.error(error);
  } else if (!this.instances_[name]) {
    error = 'Instance ' + name + ' is not initialized yet.';
    this.log_.warn(error);
  }
  if (opt_required && error) {
    throw 'Required ' + error;
  } else if (error) {
    return null;
  }
  return this.instances_[name];
};


/**
 * Shows an error message over the message instance.
 * @param {!string} error_msg
 * @export
 */
cwc.utils.Helper.prototype.showError = function(error_msg) {
  var messageInstance = this.getInstance('message');
  if (messageInstance) {
    messageInstance.error(error_msg);
  } else {
    this.log_.error(error_msg);
  }
};


/**
 * Shows a warning message over the message instance.
 * @param {!string} warn_msg
 * @export
 */
cwc.utils.Helper.prototype.showWarning = function(warn_msg) {
  var messageInstance = this.getInstance('message');
  if (messageInstance) {
    messageInstance.warning(warn_msg);
  } else {
    this.log_.warn(warn_msg);
  }
};


/**
 * Shows an info message over the message instance.
 * @param {!string} info_msg
 * @export
 */
cwc.utils.Helper.prototype.showInfo = function(info_msg) {
  var messageInstance = this.getInstance('message');
  if (messageInstance) {
    messageInstance.info(info_msg);
  } else {
    this.log_.info(info_msg);
  }
};


/**
 * Shows an success message over the message instance.
 * @param {!string} success_msg
 * @export
 */
cwc.utils.Helper.prototype.showSuccess = function(success_msg) {
  var messageInstance = this.getInstance('message');
  if (messageInstance) {
    messageInstance.success(success_msg);
  } else {
    this.log_.info(success_msg);
  }
};


/**
 * Removes all defined event listeners in the provided list.
 * @param {Array} events_list
 * @param {string=} opt_name
 * @return {!Array} empty array
 */
cwc.utils.Helper.prototype.removeEventListeners = function(events_list,
    opt_name) {
  if (events_list) {
    this.log_.debug('Clearing', events_list.length, 'events listener',
        (opt_name) ? ' for ' + opt_name : '');
    goog.array.forEach(events_list, function(listener) {
      goog.events.unlistenByKey(listener);
    });
  }
  return [];
};


/**
 * @param {string} name
 * @param {string|boolean} value
 * @param {string=} opt_group
 * @export
 */
cwc.utils.Helper.prototype.setFeature = function(name, value, opt_group) {
  this.features_.set(name, value, opt_group);
};


/**
 * @param {string} name
 * @return {boolean}
 * @export
 */
cwc.utils.Helper.prototype.checkBrowserFeature = function(name) {
  return this.checkFeature(name, 'browser');
};


/**
 * @param {string} name
 * @return {boolean}
 * @export
 */
cwc.utils.Helper.prototype.checkChromeFeature = function(name) {
  return this.checkFeature(name, 'chrome');
};


/**
 * @param {string} name
 * @return {boolean}
 * @export
 */
cwc.utils.Helper.prototype.checkJavaScriptFeature = function(name) {
  return this.checkFeature(name, 'js');
};


/**
 * @param {string} name
 * @param {string=} opt_group
 * @return {boolean}
 * @export
 */
cwc.utils.Helper.prototype.checkFeature = function(name, opt_group) {
  return this.features_.get(name, opt_group);
};


/**
 * @export
 */
cwc.utils.Helper.prototype.detectFeatures = function() {
  return this.features_.detect();
};


/**
 * @param {string} name
 * @param {string=} opt_group
 * @return {boolean}
 * @export
 */
cwc.utils.Helper.prototype.showFeatures = function(name, opt_group) {
  return this.features_.log();
};


/**
 * @export
 */
cwc.utils.Helper.prototype.getManifest = function() {
  if (this.checkChromeFeature('manifest')) {
    return chrome.runtime.getManifest();
  }
  return null;
};


/**
 * @export
 * @return {!string}
 */
cwc.utils.Helper.prototype.getAppVersion = function() {
  var manifest = this.getManifest();
  if (manifest) {
    return manifest['version'];
  }
  return String(new Date().getTime());
};


/**
 * @export
 */
cwc.utils.Helper.prototype.getFileExtensions = function() {
  var manifest = this.getManifest();
  if (manifest) {
    var fileExtensions = manifest['file_handlers']['supported']['extensions'];
    return fileExtensions;
  }
  return null;
};


/**
 * @param {string=} opt_name
 * @return {!boolean}
 * @export
 */
cwc.utils.Helper.prototype.debugEnabled = function(opt_name) {
  var name = opt_name || 'ENABLED';
  if (name in cwc.config.Debug) {
    return cwc.config.Debug[name];
  }
  return false;
};


/**
 * @param {string} status
 * @export
 */
cwc.utils.Helper.prototype.setStatus = function(status) {
  if (this.statusbarInstance_) {
    this.statusbarInstance_.setStatus(status);
  }
};


/**
 * @param {string} prefix General Prefix
 * @export
 */
cwc.utils.Helper.prototype.setPrefix = function(prefix) {
  this.prefix_ = prefix || '';
};


/**
 * @return {!cwc.utils.Logger}
 * @export
 */
cwc.utils.Helper.prototype.getLogger = function() {
  return this.log_;
};


/**
 * @param {string=} opt_additional_prefix
 * @return {string}
 * @export
 */
cwc.utils.Helper.prototype.getPrefix = function(
    opt_additional_prefix) {
  if (opt_additional_prefix) {
    return this.prefix_ + opt_additional_prefix + '-';
  }
  return this.prefix_;
};


/**
 * @param {Function} func
 * @param {Function=} opt_callback
 */
cwc.utils.Helper.prototype.handleUnsavedChanges = function(func, opt_callback) {
  var dialog = new goog.ui.Dialog();
  var fileName = '';
  var fileModified = false;
  var fileInstance = this.getInstance('file');
  if (fileInstance) {
    fileName = fileInstance.getFileTitle();
    fileModified = fileInstance.isModified();
  }

  console.log('File was modified:', fileModified);
  if (fileModified) {
    dialog.setTitle('Unsaved Changes for ' + fileName);
    dialog.setSafeHtmlContent(goog.html.SafeHtml.concat(
      'Changes have not been saved.',
      goog.html.SafeHtml.BR,
      goog.html.SafeHtml.create('b', {}, 'Exit?')));
    dialog.setButtonSet(goog.ui.Dialog.ButtonSet.createYesNo());
    dialog.setDisposeOnHide(true);
    dialog.render();

    goog.events.listen(dialog, goog.ui.Dialog.EventType.SELECT,
        function(event) {
          if (event.key == 'yes') {
            func();
            if (opt_callback) {
              opt_callback(true);
            }
          } else {
            if (opt_callback) {
              opt_callback(false);
            }
          }
        }, false, this);
    dialog.setVisible(true);
  } else {
    func();
    if (opt_callback) {
      opt_callback(true);
    }
  }
};


/**
 * @export
 */
cwc.utils.Helper.prototype.uninstallStyles =
    cwc.ui.Helper.uninstallStyles;
