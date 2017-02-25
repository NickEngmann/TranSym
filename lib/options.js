Options = (function(){
    return {
      except_urls: function(urls) {
        if (urls instanceof Array) {
          localStorage['except_urls'] = urls.join(',');
        }
        return localStorage['except_urls'] ? localStorage['except_urls'].split(',') : [];
      },
        only_urls: function(urls) {
            if (urls instanceof Array) {
                localStorage['only_urls'] = urls.join(',');
            }
            return localStorage['only_urls'] ? localStorage['only_urls'].split(',') : [];
        },
      target_lang: function(lang) {
        if (lang) {
          localStorage['target_lang'] = lang;
        }
        return localStorage['target_lang'];
      },
      from_lang: function(lang) {
        if (lang) {
          localStorage['from_lang'] = lang;
        }
        return localStorage['from_lang'] || 'auto';
      },
      reverse_lang: function(lang) {
        if (arguments.length > 0) {
          localStorage['reverse_lang'] = lang;
        }
        return localStorage['reverse_lang'];
      },
      word_key_only: function(arg) {
        if (arg != undefined) {
          localStorage['word_key_only'] = arg;
        }
        return parseInt( localStorage['word_key_only'] );
      },
      selection_key_only: function(arg) {
        if (arg != undefined) {
          localStorage['selection_key_only'] = arg;
        }
        return parseInt( localStorage['selection_key_only'] );
      },
      tts: function(arg) {
        if (arg != undefined) {
          localStorage['tts'] = arg;
        }
        return parseInt( localStorage['tts'] );
      },
      tts_key: function(arg) {
        if (arg != undefined) {
          localStorage['tts_key'] = arg;
        }
        return localStorage['tts_key'] || 'ctrl';
      },
      translate_by: function(arg) {
        if (arg == 'click' || arg == 'point') {
          localStorage.translate_by = arg;
        }
        return localStorage.translate_by || 'click';
      },
      delay: function(ms) {
        if (ms != undefined && !isNaN(parseFloat(ms)) && isFinite(ms)) {
          localStorage['delay'] = ms;
        }
        return localStorage['delay'] == undefined ? 700 : parseInt(localStorage['delay']);
      },
      do_not_show_oops: function(arg) {
        if (arg != undefined) {
          localStorage['do_not_show_oops'] = arg;
        }
        return parseInt( localStorage['do_not_show_oops'] );
      },
      popup_show_trigger: function(arg) {
        if (arg != undefined) {
          localStorage['popup_show_trigger'] = arg;
        }
        return localStorage['popup_show_trigger'] || 'alt';
      }
    };
})();
