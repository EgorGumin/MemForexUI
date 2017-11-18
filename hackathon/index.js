const express       = require('express');
const bodyParser    = require('body-parser');
const config        = require('./config');
const pgp           = require('pg-promise')();
const db            = pgp(config.db);

let app = express();

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.get('/', (req, res) => {
    res.send("");
});

app.post('/login', async (req, res) => {
    if (req.body.login && req.body.password) {
        let login = req.body.login;
        let pass = req.body.password;

        try {
            var row = await db.query("SELECT * FROM users WHERE login = $1 AND pass = $2", [login, pass]);
        }
        catch (e) {
            console.log(e.message);
            res.status(500).send();
        }

        if (row && row.length === 1) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({
                id: row[0].id,
                token: row[0].token
            }));
        }
        else {
            res.status(401).send();
        }
    }
});


app.get('/rates', async (req, res) => {
    let token = req.query.token;

    try {
        if (token) {
            let user = await db.query("SELECT id FROM Users WHERE token = $1", [token]);
            if (user.length === 0) {
                throw new Error("401");
            }
        }
        else {
            throw new Error("401");
        }

        let tags = await db.query("SELECT id, name, alias FROM Tags");
        let respData = []

        for (let i = 0; i < tags.length; ++i) {
            let lastRate = await db.query("SELECT rate_relative, rate_absolute, rate_date FROM Rates WHERE tag_id = $1 ORDER BY rate_date DESC LIMIT 1", [tags[i].id]);
            if (lastRate.length !== 0) {
                respData.push({
                    id: tags[i].id,
                    name: tags[i].name,
                    alias: tags[i].alias,
                    date: lastRate[0].rate_date,
                    rateRelative: lastRate[0].rate_relative,
                    rateAbsolute: lastRate[0].rate_absolute
                });
            }
        }

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(respData));
    }
    catch (e) {
        console.log(e.message);
        res.status(parseInt(e.message)).send();
    }
});


app.get('/rates/all', async (req, res) => {
    let token = req.query.token;

    try {
        if (token) {
            let user = await db.query("SELECT id FROM Users WHERE token = $1", [token]);
            if (user.length === 0) {
                throw new Error("401");
            }
        }
        else {
            throw new Error("401");
        }

        let tags = await db.query("SELECT id, name, alias FROM Tags");
        let respData = []

        for (let i = 0; i < tags.length; ++i) {
            let lastRate = await db.query("SELECT rate_relative, rate_absolute, rate_date FROM Rates WHERE tag_id = $1 ORDER BY rate_date ASC", [tags[i].id]);
            for (let j = 0; j < lastRate.length; ++j) {
                respData.push({
                    id: tags[i].id,
                    name: tags[i].name,
                    alias: tags[i].alias,
                    date: lastRate[j].rate_date,
                    rateRelative: lastRate[j].rate_relative,
                    rateAbsolute: lastRate[j].rate_absolute
                });
            }
        }

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(respData));
    }
    catch (e) {
        console.log(e.message);
        res.status(parseInt(e.message)).send();
    }
});


app.get('/rate/:id', async (req, res) =>{
    let id = req.params.id;
    let token = req.query.token;

    try {
        if (token) {
            let user = await db.query("SELECT id FROM Users WHERE token = $1", [token]);
            if (user.length === 0) {
                throw new Error("401");
            }
        }
        else {
            throw new Error("401");
        }

        let tags = await db.query("SELECT id, name, alias FROM Tags WHERE id = $1", [id]);
        let lastRate = await db.query("SELECT rate_relative, rate_absolute, rate_date FROM Rates WHERE tag_id = $1 ORDER BY rate_date DESC LIMIT 1", [tags[0].id]);
        let respData = [];
        if (lastRate.length !== 0) {
            respData.push({
                id: tags[0].id,
                name: tags[0].name,
                alias: tags[0].alias,
                date: lastRate[0].rate_date,
                rateRelative: lastRate[0].rate_relative,
                rateAbsolute: lastRate[0].rate_absolute
            });
        }
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify());
    }
    catch (e) {
        console.log(e.message);
        res.status(parseInt(e.message)).send();
    }


});

app.get('/wallet', async (req, res) => {
    let userId = req.query.user_id;
    let token = req.query.token;

    try {
        if (token) {
            let user = await db.query("SELECT id FROM Users WHERE token = $1 AND id = $2", [token, userId]);
            if (user.length === 0) {
                throw new Error("401");
            }
        }
        else {
            throw new Error("401");
        }

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(
            await db.query("SELECT Wallet_records.tag_id AS tagId, Tags.alias as alias, Wallet_records.quantity FROM Wallet_records, Tags WHERE user_id = $1 AND Tags.id = Wallet_records.tag_id", [userId])
        ));

    }
    catch (e) {
        console.log(e.message);
        res.status(parseInt(e.message)).send();
    }
});


app.post('/pay', async (req, res) => {
    let from = req.body.from_tag_id;
    let to = req.body.to_tag_id;
    let quantity = parseFloat(req.body.quantity);
    let userId = req.body.user_id;
    let token = req.body.token;

    try {
        if (token) {
            let user = await db.query("SELECT id FROM Users WHERE id = $1 AND token = $2", [userId, token]);
            if (user.length === 0) {
                throw new Error("401");
            }
        }
        else {
            throw new Error("401");
        }

        let fromQuantity = await db.query("SELECT quantity FROM Wallet_records WHERE user_id = $1 AND tag_id = $2", [userId, from]);
        console.log(parseFloat(fromQuantity[0].quantity) + " " + quantity);

        if (fromQuantity.length === 0 || parseFloat(fromQuantity[0].quantity) < quantity) {
            throw new Error("412");
        }

        try {
            let quantityFrom = 0;
            let quantityTo = 0;

            await db.tx(async (txHandler) => {
                let queries = [];

                queries.push(
                    txHandler.none("UPDATE Wallet_records SET quantity = quantity - $1 WHERE user_id = $2 AND tag_id = $3", [quantity, userId, from])
                );

                let _from = await db.query("SELECT rate_relative FROM Rates WHERE tag_id = $1 ORDER BY rate_date DESC LIMIT 1", [from]);
                let _to = await db.query("SELECT rate_relative FROM Rates WHERE tag_id = $1 ORDER BY rate_date DESC LIMIT 1",[to]);
                let fromRate = parseFloat(_from[0].rate_relative);
                let toRate = parseFloat(_to[0].rate_relative);

                //console.log(fromRate + " " + toRate);
                quantityFrom = quantity;
                quantityTo = quantity * fromRate / toRate;


                queries.push(
                    txHandler.none("UPDATE Wallet_records SET quantity = quantity + $1 WHERE user_id = $2 AND tag_id = $3", [quantityTo, userId, to])
                );
                return txHandler.batch(queries);
            });

            await db.none("INSERT INTO Exchange_events (user_id, tag_to_id, quantity_to, tag_from_id, quantity_from, event_date) VALUES($1, $2, $3, $4, $5, $6)", [userId, to, quantityTo, from, quantityFrom, new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')])
        }
        catch (e) {
            throw new Error("500");
        }
        res.send("");
    }
    catch (e) {
        console.log(e.message);
        res.status(parseInt(e.message)).send();
    }
});


app.listen(8080, () => {
  console.log("Running...");
});
