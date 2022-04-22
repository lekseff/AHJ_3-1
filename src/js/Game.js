export default class Game {
  constructor(container) {
    this.board = container.querySelector('#board');
    this.images = container.querySelector('#goblin');
    this.killed = container.querySelector('#killed');
    this.missing = container.querySelector('#missing');
    this.popup = container.querySelector('#popup');
    this.boardSize = 4; // Размер поля
    this.currentPosition = null; // Текущая позиция гоблина
    this.killedScore = null; // Количество паданий
    this.missingScore = null; // Количество промахов
    this.maxMissingScore = 10; // Максимальное количество промахов
    this.timeoutId = null;
    this.interval = null; // Интервал перемещения гоблина

    this.renderBoard();
    this.registerEvents();
  }

  /**
   * Создает элемент поля
   * @returns - html элемент
   */
  static createCell() {
    const element = document.createElement('div');
    element.classList.add('game__board-cell');
    return element;
  }

  /**
   * Добавляет события
   */
  registerEvents() {
    const popupButton = this.popup.querySelector('.popup__button');
    this.board.addEventListener('click', this.eventHandler.bind(this));
    popupButton.addEventListener('click', this.closePopup.bind(this));
  }

  /**
   * Старт игры
   */
  startGame() {
    this.killed.textContent = 0;
    this.missing.textContent = 0;
    this.killedScore = 0;
    this.missingScore = 0;
    this.interval = 1000;
    this.nextStep();
  }

  /**
   * Рендер поля
   */
  renderBoard() {
    for (let i = 0; i < this.boardSize ** 2; i += 1) {
      this.board.append(Game.createCell());
    }
  }

  /**
   * Обработка клика по полю
   * @param {*} event - event
   */
  eventHandler(event) {
    if (event.target.tagName === 'IMG') {
      this.killedScore += 1;
      this.killed.textContent = this.killedScore;
      this.gameSpeed();
      this.nextStep();
    } else {
      this.missingScore += 1;
      this.missing.textContent = this.missingScore;
      this.checkingEndGame();
    }
  }

  /**
   * Закрывает popup и запускает новую игру
   */
  closePopup() {
    this.popup.classList.add('popup__hidden');
    this.startGame();
  }

  /**
   * Следующий шаг игры
   */
  nextStep(statusGame = true) {
    // Удаляем интервал, если он есть
    if (this.timeoutId) clearTimeout(this.timeoutId);
    // Продолжаем игру или выходим (true - продолжаем, false - заканчиваем)
    if (!statusGame) return;
    const position = this.randomPosition();
    this.board.children[position].append(this.images);
    this.timeoutId = setTimeout(() => {
      this.nextStep();
    }, this.interval);
  }

  /**
   * Проверка окончания игры
   * @returns - true или false
   */
  checkingEndGame() {
    if (this.missingScore < this.maxMissingScore) {
      // this.nextStep();
      return true;
    }
    this.nextStep(false);
    this.popup.querySelector('.popup__score').textContent = `Счёт: ${this.killedScore}`;
    this.popup.classList.remove('popup__hidden');
    return false;
  }

  /**
   * Скорость игры
   */
  gameSpeed() {
    if (this.killedScore > 5 && this.killedScore < 10) {
      this.interval = 850;
    }
    if (this.killedScore >= 10 && this.killedScore < 14) {
      this.interval = 750;
    }
    if (this.killedScore >= 14 && this.killedScore < 20) {
      this.interval = 650;
    }
    if (this.killedScore >= 20) {
      this.interval = 550;
    }
  }

  /**
   * Генератор случайной позиции
   * @returns Номер позиции
   */
  randomPosition() {
    const maxValue = this.boardSize ** 2;
    let position = Math.floor(Math.random() * maxValue);
    while (position === this.currentPosition) {
      position = Math.floor(Math.random() * maxValue);
    }
    this.currentPosition = position;
    return position;
  }
}
