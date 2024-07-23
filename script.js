(function(){
	
	//  объявляем объект, внутри которого будет происходить основная механика игры
	var Memory = {
		
		// создаём карточку
		init: function(cards){
			//  получаем доступ к классам
			this.$wrap = $(".wrap");
			this.$game = $(".game");
			this.$modal = $(".modal");
			this.$overlay = $(".modal-overlay");
			this.$restartButton = $("button.restart");
			// собираем из карточек массив — игровое поле. merge - слияние двух массивов в один
			this.cardsArray = $.merge(cards, cards);
			// перемешиваем карточки
			this.shuffleCards(this.cardsArray);
			// и раскладываем их
			this.setup();
		},

		// как перемешиваются карточки
		shuffleCards: function(cardsArray){
			// используем встроенный метод .shuffle
			this.$cards = $(this.shuffle(this.cardsArray));
		},

		// раскладываем карты
		setup: function(){
			// код с карточками
			this.html = this.buildHTML();
			// добавляем код в блок с игрой
			this.$game.html(this.html);
			// доступ к сформированным карточкам
			this.$memoryCards = $(".card");
			// переворот второй карточки
			this.card_2 = false;
			// переворот первой карточки
     		this.card_1 = null;
			// балл карты
			this.now_point = null;
     		// добавляем элементам на странице реакции на нажатия
			this.binding();
		},

		// реакция на нажатия
		binding: function(){
			// нажатие на карточку
			this.$memoryCards.on("click", this.cardClicked);
			// нажатие на кнопку перезапуска игры
			this.$restartButton.on("click", $.proxy(this.reset, this));
		},

		// если нажимаем на карточку
		cardClicked: function(){
			var _ = Memory;
			var $card = $(this);
			// если карточка не перевёрнута и мы не нажимаем на ту же самую карточку второй раз подряд
			if(!_.card_2 && !$card.find(".inside").hasClass("matched") && !$card.find(".inside").hasClass("picked")){
				// переворачиваем её
				$card.find(".inside").addClass("picked");
				if(!_.card_1){
					// сохраняем первую карточку
					_.card_1 = $(this).attr("data-id");
				// если мы перевернули вторую и она совпадает с первой
				} else if(_.card_1 == $(this).attr("data-id") && !$(this).hasClass("picked")){
					// оставляем обе на поле перевёрнутыми и показываем анимацию совпадения
					$(".picked").addClass("matched");
					//сохраняем балл карточки
					_.now_point =  $(this).find(".card-point").attr("data-pt");
					//добавляем балл игроку и отображаем его
					_.score(_.now_point);
					// обнуляем первую карточку
					_.card_1 = null;
						// если вторая не совпадает с первой
						} else {
							// обнуляем первую карточку
							_.card_1 = null;
							// не ждём переворота второй карточки
							_.card_2 = true;
							// ждём полсекунды и переворачиваем всё обратно
							setTimeout(function(){
								$(".picked").removeClass("picked");
								Memory.card_2 = false;
							}, 600);
						}
				// если перевернули все карточки
				if($(".matched").length == $(".card").length){
					// показываем победное сообщение
					_.win();
				}
			}
		},

		//добавляем баллы игроку и отображаем их
		score: function(newpoint){
			var newPointElement = document.querySelector('.new_point');
			var currentNumber = parseInt(newPointElement.textContent);
			var currentPoint = parseInt(newpoint);
			var newNumber = currentNumber + currentPoint;
			newPointElement.textContent = Number(newNumber);
		},

		//обнуляем баллы игрока
		null_score: function(){
			var newPointElement = document.querySelector('.new_point');
			newPointElement.textContent = 0;
		},

		// показываем победное сообщение
		win: function(){
			// не ждём переворота карточек
			this.card_2 = true;
			// плавно показываем модальное окно
			setTimeout(function(){
				Memory.showModal();
				Memory.$game.fadeOut();
			}, 1000);
		},

		// показываем модальное окно
		showModal: function(){
			// плавно делаем блок с сообщением видимым
			this.$overlay.show();
			this.$modal.fadeIn("slow");
		},

		// убираем модальное окно
		hideModal: function(){
			this.$overlay.hide();
			this.$modal.hide();
		},

		// перезапускаем игру
		reset: function(){
			//обнуляем баллы игрока
			this.null_score();
			// прячем модальное окно с поздравлением
			this.hideModal();
			// перемешиваем карточки
			this.shuffleCards(this.cardsArray);
			// раскладываем карточки
			this.setup();
			// показываем игровое поле
			this.$game.show("slow");
		},

		// тасование Фишера–Йетса
		shuffle: function(array){
			var counter = array.length, temp, index;
		   	while (counter > 0) {
	        	index = Math.floor(Math.random() * counter);
	        	counter--;
	        	temp = array[counter];
	        	array[counter] = array[index];
	        	array[index] = temp;
		    	}
		    return array;
		},

		// добавление карточек на страницу
		buildHTML: function(){
			var frag = '';
			this.$cards.each(function(k, v){
				frag += '<div class="card" data-id="'+ v.id +'">\
					<div class="inside">\
						<div class="front">\
							<div class="card-point" data-pt="'+ v.point +'">\
							'+ v.point +'\
							</div>\
							<img src="'+ v.img +'"alt="'+ v.name +'" />\
						</div>\
						<div class="back"></div>\
					</div>\
				</div>';
			});
			return frag;
		}
	};

	var cards = [];

	// Получение данных из базы данных через AJAX-запрос
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'getdata.php', true);
	xhr.onreadystatechange = function() {
	  if (xhr.readyState === 4 && xhr.status === 200) {
		cards = JSON.parse(xhr.responseText);
		// Продолжение работы с данными в JavaScript
		console.log(cards);
		// запускаем игру
		Memory.init(cards);
	  }
	};
	xhr.send();

})();
