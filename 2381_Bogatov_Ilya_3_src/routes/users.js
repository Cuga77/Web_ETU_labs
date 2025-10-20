import express from 'express';
import createHttpError from "http-errors";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const API_URL = process.env.API_URL || 'http://localhost:3000/api';
const recordsPerPage = 15;

async function renderUsers(req, res, next, heading, query = null) {
    const currentPage = parseInt(req.query.page) || 1;
    const skip = (currentPage - 1) * recordsPerPage;

    try {
        let url = `${API_URL}/user?skip=${skip}&limit=${recordsPerPage}`;
        let options = { method: 'GET' };

        if (query) {
            url = `${API_URL}/user/filter`;
            options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ skip, limit: recordsPerPage, query })
            };
        }

        const response = await fetch(url, options);
        const { totalCount, value } = await response.json();

        res.render('users', { heading, currentPage, totalPages: Math.max(Math.ceil(totalCount / recordsPerPage), 1), users: value }, (err, html) => {
            if (err) return next(createHttpError(err));
            res.render('layout', { title: `${heading}. Global`, customScripts: ['users'], main: html });
        });
    } catch (err) {
        next(createHttpError(err));
    }
}

async function renderFollowList(req, res, next, type) {
    const { userId } = req.params;
    const currentPage = parseInt(req.query.page) || 1;
    const skip = (currentPage - 1) * recordsPerPage;

    try {
        const userResponse = await fetch(`${API_URL}/user/${userId}`);
        const user = await userResponse.json();
        if (user.error) return next(createHttpError(user.error));

        const followResponse = await fetch(`${API_URL}/user/${userId}/${type}?skip=${skip}&limit=${recordsPerPage}`);
        const { totalCount, value } = await followResponse.json();
        if (value.error) return next(createHttpError(value.error));

        const heading = type === 'followers' ? `Подписчики ${user.firstName} ${user.lastName}` : `Подписки ${user.firstName} ${user.lastName}`;

        res.render('followList', { heading, currentPage, totalPages: Math.max(Math.ceil(totalCount / recordsPerPage), 1), users: value }, (err, html) => {
            if (err) return next(createHttpError(err));
            res.render('layout', { title: `${heading}. Global`, customScripts: [], main: html });
        });
    } catch (err) {
        next(createHttpError(err));
    }
}

router.get('/all', (req, res, next) => renderUsers(req, res, next, 'Список пользователей'));
router.get('/unconfirmed', (req, res, next) => renderUsers(req, res, next, 'Список неподтверждённых пользователей', { status: 'inactive' }));
router.get('/blocked', (req, res, next) => renderUsers(req, res, next, 'Список заблокированных пользователей', { status: 'blocked' }));

router.get('/add', function (req, res, next) {
    res.render('manage', {type: 'add'}, (err, html) => {
        if (err)
            return next(createHttpError(err));

        res.render('layout', {
            title: `Добавление пользователя. Global`,
            customScripts: ['manage'],
            main: html
        });
    });
});

router.get('/:userId', function (req, res, next) {
    fetch(API_URL + `/user/${req.params.userId}`, {
        method: 'GET'
    }).then((response) => response.json())
        .then((user) => {
            if (user.error)
                return next(createHttpError(user.error));

            res.render('user', {user}, (err, html) => {
                if (err)
                    return next(createHttpError(err));

                res.render('layout', {
                    title: `${user.firstName} ${user.lastName}. Global`,
                    customScripts: ['user'],
                    main: html
                });
            });
        })
        .catch((err) => {
            next(createHttpError(err));
        });
});

router.get('/:userId/edit', function (req, res, next) {
    fetch(API_URL + `/user/${req.params.userId}`, {
        method: 'GET'
    }).then((response) => response.json())
        .then((user) => {
            if (user.error)
                return next(createHttpError(user.error));
            res.render('manage', {type: 'edit', user}, (err, html) => {
                if (err)
                    return next(createHttpError(err));

                res.render('layout', {
                    title: `Редактирование пользователя. Global`,
                    customScripts: ['manage'],
                    main: html
                });
            });
        })
        .catch((err) => {
            next(createHttpError(err));
        });
});

router.get('/:userId/followers', (req, res, next) => renderFollowList(req, res, next, 'followers'));
router.get('/:userId/following', (req, res, next) => renderFollowList(req, res, next, 'following'));

export default router;