// Запуск внутри Telegram (Mini App): во весь экран, свои цвета, без закрытия свайпом.
// Вне Telegram ничего не делает.
(function () {
  var tg = window.Telegram && window.Telegram.WebApp;
  if (!tg || (!tg.initData && tg.platform === 'unknown')) return;
  var at = function (v) { try { return tg.isVersionAtLeast(v); } catch (e) { return false; } };
  document.documentElement.classList.add('in-tg');
  try { tg.ready(); } catch (e) {}
  try { tg.expand(); } catch (e) {}
  // свайп вниз по заданию не должен закрывать приложение
  if (at('7.7')) try { tg.disableVerticalSwipes(); } catch (e) {}
  if (at('6.1')) try { tg.setHeaderColor('#0D0A0B'); tg.setBackgroundColor('#0D0A0B'); } catch (e) {}
  if (at('7.10')) try { tg.setBottomBarColor('#0D0A0B'); } catch (e) {}

  // на компьютере Telegram открывает маленькое окно, как телефон, — просим полный экран
  var desk = !/^(android|android_x|ios)$/.test(tg.platform);
  if (!desk) return;
  if (at('8.0')) try { tg.requestFullscreen(); } catch (e) {}

  // запасной путь: кнопка «Во весь экран» (если Telegram не дал полный экран сам)
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'tg-full';
  btn.textContent = '⛶ Во весь экран';
  var msg = function (t) { try { tg.showAlert(t); } catch (e) { alert(t); } };
  btn.onclick = function () {
    if (!at('8.0')) return msg('Ваш Telegram не умеет полный экран (версия ' + tg.version + '). Обновите Telegram Desktop — или растяните окно мышкой за угол.');
    try { tg.requestFullscreen(); } catch (e) { msg('Не получилось: ' + e.message); }
  };
  var sync = function () { btn.hidden = !!tg.isFullscreen; };
  try {
    tg.onEvent('fullscreenChanged', sync);
    tg.onEvent('fullscreenFailed', function (e) {
      btn.hidden = false;
      if (e && e.error === 'UNSUPPORTED') msg('Telegram на этом компьютере не поддерживает полный экран. Растяните окно мышкой за угол или обновите Telegram Desktop.');
    });
  } catch (e) {}
  var add = function () { document.body.appendChild(btn); setTimeout(sync, 1500); };
  if (document.body) add(); else document.addEventListener('DOMContentLoaded', add);
})();
