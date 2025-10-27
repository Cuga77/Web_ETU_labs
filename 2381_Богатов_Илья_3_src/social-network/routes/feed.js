import { Router } from 'express';
import createHttpError from "http-errors";
import dotenv from "dotenv";

dotenv.config();
const router = Router();

const API_URL = process.env.API_URL;
const recordsPerPage = 15;

router.get('/all', function (req, res, next) {
    fetch(API_URL + `/post?skip=${((parseInt(req.query.page) || 1) - 1) * recordsPerPage}&limit=${recordsPerPage}`, {
        method: 'GET'
    }).then((response) => response.json())
        .then(({totalCount, posts, authors}) => {
            res.render('feed', {heading: 'Общие посты', currentPage: parseInt(req.query.page) || 1, totalPages: Math.max(Math.ceil(totalCount / recordsPerPage), 1), posts, authors: new Map(authors.map(obj => [obj._id, obj]))}, (err, html) => {
                if (err)
                    return next(createHttpError(err));

                res.render('layout', {
                    title: 'Общие посты',
                    customScripts: ['feed'],
                    main: html
                });
            });
        })
        .catch((err) => {
            next(createHttpError(err));
        });
});

router.get('/:userId', function (req, res, next) {
    fetch(API_URL + `/user/${req.params.userId}`, {
        method: 'GET'
    }).then((response) => response.json())
        .then((user) => {
            if (user.error)
                return next(createHttpError(user.error));

            fetch(API_URL + `/feed/${req.params.userId}?skip=${((parseInt(req.query.page) || 1) - 1) * recordsPerPage}&limit=${recordsPerPage}`, {
                method: 'GET'
            }).then((response) => response.json())
                .then(({totalCount, posts, authors}) => {
                    res.render('feed', {heading: `Посты ${user.firstName} ${user.lastName}`, currentPage: parseInt(req.query.page) || 1, totalPages: Math.max(Math.ceil(totalCount / recordsPerPage), 1), posts, authors: new Map(authors.map(obj => [obj._id, obj]))}, (err, html) => {
                        if (err)
                            return next(createHttpError(err));

                        res.render('layout', {
                            title: `Посты ${user.firstName} ${user.lastName}`,
                            customScripts: ['feed'],
                            main: html
                        });
                    });
                })
                .catch((err) => {
                    next(createHttpError(err));
                });
        })
        .catch((err) => {
            next(createHttpError(err));
        });
});

export default router;
