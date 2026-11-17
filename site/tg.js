// Запуск внутри Telegram (Mini App): во весь экран, свои цвета, без закрытия свайпом.
// Вне Telegram ничего не делает.
(function () {
  var tg = window.Telegram && window.Telegram.WebApp;
  if (!tg || !tg.initData) return;
  var at = function (v) { try { return tg.isVersionAtLeast(v); } catch (e) { return false; } };
  document.documentElement.classList.add('in-tg');
  try { tg.ready(); } catch (e) {}
  try { tg.expand(); } catch (e) {}
  // свайп вниз по заданию не должен закрывать приложение
  if (at('7.7')) try { tg.disableVerticalSwipes(); } catch (e) {}
  if (at('6.1')) try { tg.setHeaderColor('#0D0A0B'); tg.setBackgroundColor('#0D0A0B'); } catch (e) {}
  if (at('7.10')) try { tg.setBottomBarColor('#0D0A0B'); } catch (e) {}
  // на компьютере Telegram открывает маленькое окно, как телефон, — просим полный экран
  if (/^(tdesktop|macos)$/.test(tg.platform) && at('8.0')) try { tg.requestFullscreen(); } catch (e) {}
})();
