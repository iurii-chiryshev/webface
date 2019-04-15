/**
 * Created by Iurii on 17.12.2015.
 *
 * Базовый класс для всех моделей, связанных с безопасностью проекта.
 * Т.е. самый "крутой" пользователь будет иметь право выставлять
 * видимости пользователей, привязывать их к группам, создавать структуру
 * меню и пр.
 *
 * @class Webface.model.security.Base
 * @author Iurii Chiryshev <iurii.chiryshev@mail.ru>
 */
Ext.define('Webface.model.security.Base', {
    extend: 'Webface.model.Base',

    schema: {
        /**
         * Объявление пространства имен куда будут входить
         * модели, относящиеся к безопасности
         */
        namespace: 'Webface.model.security'
    }
});