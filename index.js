const { Telegraf, Markup } = require('telegraf');

const mongoose = require('mongoose');
const urlmdb = "mongodb://localhost:27017/newYearSamocat"
const sharp = require('sharp');
const fetch = require("node-fetch");

async function stageSave(stage = "start", userid, log) {
    console.log(stage)
    const dbuser = await User.findOne({ userid: userid })
    dbuser.stage = stage
    new Promise(r => setTimeout(r, 600))
    dbuser.save()

}




function firstch(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function addText(array, id) {
    let messarr = []
    for (let i = 0; i < array.length; i++) {
        let mess = firstch(array[i])
        messarr.push(mess)
    }

    const width = 1170;
    const height = 2080;


    const svgText = `
    <svg width="${width}" height="${height}">
    <style> 
    @font-face {
      font-family: Euclid;
      src: url(EuclidCircularA-Regular.ttf);
    }

    .title {
      fill: black;
      font-size: 55px;
      font-family: Euclid;
    }
    </style>
      <text x="17%" y="952" text-anchor="left" class="title" font-width="bold">${messarr[0]}</text>
      <text x="17%" y="1092" text-anchor="left" class="title" font-width="bold">${messarr[1]}</text>
      <text x="17%" y="1231" text-anchor="left" class="title" font-width="bold">${messarr[2]}</text>
      <text x="17%" y="1371" text-anchor="left" class="title" font-width="bold">${messarr[3]}</text>
      <text x="17%" y="1511" text-anchor="left" class="title" font-width="bold">${messarr[4]}</text>
    </svg>`

    const svgBuffer = Buffer.from(svgText);


    sharp('./assets/11111.jpg')
        .composite([{ input: svgBuffer, left: 0, top: 0 }])
        .toFile(__dirname + `./assets/${id}.jpg`)
}


async function main() {
    await mongoose.connect(urlmdb)
}
main().catch(err => console.log(err));


const User = mongoose.model("User", {
    userid: Number,
    username: String,
    stage: String,
    promo: String,
    lspromo: String,
    couch: Number,
    couchMessage: Array,
    moder: Boolean,
    mail: Object,
    created: Date,
});
const Message = mongoose.model("Message", {
    userid: Number,
    stage: String,
    message: Array,
    link: Array,
    idmessage: Number,
    approved: Boolean,
    sended: Number,
    chekList: Array,
});
const Mail = mongoose.model("Mail", {
    file_id: String,
    user_id: Number,
    moder: Boolean,
    sends: Number,
    format: String,
}
    // const Couch = mongoose.model("Couch",{
    //     userid: Number
    //     message:
    // })

)


bot.start(async (ctx) => {
    const stage = "start"
    const username = ctx.update.message.chat.username;
    const userid = ctx.update.message.chat.id;
    const dbuser = await User.findOne({ username: username })
    await new Promise(r => setTimeout(r, 600))

    if (dbuser) {

        dbuser.stage = "start"
        await dbuser.save()
    }

    if (!dbuser) {
        const user = new User({
            userid: userid,
            username: username,
            stage: "start",
            promo: 0,
            lspromo: 0,
            couch: 0,
            couchMessage: [],
            moder: false,
            created: Date.now(),
        });
        await user.save();

    }
    //await Mail.updateMany({ moder: "true" }, { $set: { sends: 0 } })

    let mess = await Message.findOne({ stage: stage })
    await ctx.replyWithVideoNote({ source: "./assets/main/111.mp4" })
    //await ctx.replyWithVideo("BAACAgIAAxkBAAETP_tjmYWc4Hi3xbaeaDVaHW5Ly-I13AACByMAAmtxyEiCUW-MWRhjyywE", {})
    await ctx.reply(mess.message[0],
        {
            parse_mode: "HTML",
            ...Markup.inlineKeyboard([
                [Markup.button.callback("Включить музыку", "DJ-00")],
                [Markup.button.callback("Отправить послание", "Mail-00")],
                [Markup.button.callback("Составить добрый чек-лист", "Couch-00")],
                [Markup.button.callback("Получить предсказание", "Oracl-00")],
            ]),
        })
})


bot.action("start", async (ctx) => {

    await ctx.answerCbQuery()
    const stage = "start"
    const user_id = ctx.update.callback_query.from.id


    const dbuser = await User.findOne({ userid: user_id })
    const mess = await Message.findOne({ stage: stage })
    await new Promise(r => setTimeout(r, 600))
    dbuser.stage = "start"
    await dbuser.save()

    if (dbuser.moder) {
        await ctx.editMessageText(mess.message[1],

            {

                parse_mode: "HTML",
                disable_web_page_preview: true,

                ...Markup.inlineKeyboard([
                    [Markup.button.callback("Включить музыку", "DJ-00")],
                    [Markup.button.callback("Отправить послание", "Mail-00")],
                    [Markup.button.callback("Составить добрый чек-лист", "Couch-00")],
                    [Markup.button.callback("Получить предсказание", "Oracl-00")],
                    [Markup.button.callback("МОДЕРИРОВАНИЕ", "Moder-00")]
                ]),
            }
        )
    }


    if (!dbuser.moder) {
        await ctx.editMessageText(mess.message[1],
            {
                parse_mode: "HTML",
                disable_web_page_preview: true,
                ...Markup.inlineKeyboard([
                    [Markup.button.callback("Включить музыку", "DJ-00")],
                    [Markup.button.callback("Отправить послание", "Mail-00")],
                    [Markup.button.callback("Составить добрый чек-лист", "Couch-00")],
                    [Markup.button.callback("Получить предсказание", "Oracl-00")],
                ]),
            }
        )
    }
})



bot.action("DJ-00", async (ctx) => {

    await ctx.answerCbQuery()
    const stage = "DJ-00"
    const user_id = ctx.update.callback_query.from.id
    const dbuser = await User.findOne({ userid: user_id })
    await new Promise(r => setTimeout(r, 600))
    dbuser.stage = "DJ-00"
    await dbuser.save()

    const mess = await Message.findOne({ stage: "DJ-00" })

    await ctx.replyWithPhoto({ source: "./assets/DJ.png" }
        , { caption: mess.message[0], parse_mode: "HTML" })

    await ctx.replyWithAudio({ source: "./assets/audio/В ритме праздника.mp3" })
    await ctx.replyWithAudio({ source: "./assets/audio/Время подарков.mp3" })
    await ctx.replyWithAudio({ source: "./assets/audio/Зима пришла.mp3" })
    await ctx.replyWithAudio({ source: "./assets/audio/Зимняя сказка.mp3" })
    await ctx.replyWithAudio({ source: "./assets/audio/Новогодний джаз.mp3" })
    await ctx.reply(mess.message[1],
        Markup.inlineKeyboard([
            [Markup.button.callback("Да", "DJ-01")],
            [Markup.button.callback("Вернуться в главное меню ↩️", "start")]])
    )
})

bot.action("DJ-01", async (ctx) => {

    await ctx.answerCbQuery()
    const stage = "DJ-00"
    const dbuser = await User.findOne({ userid: ctx.update.callback_query.from.id })
    await new Promise(r => setTimeout(r, 600))
    dbuser.stage = "DJ-00"
    await dbuser.save()
    const mess = await Message.findOne({ stage: stage })



    await ctx.replyWithAudio({ source: "./assets/audio/Праздничная суета.mp3" })
    await ctx.replyWithAudio({ source: "./assets/audio/Снежный дворец.mp3" })
    await ctx.replyWithAudio({ source: "./assets/audio/Снежный лес.mp3" })
    await ctx.replyWithAudio({ source: "./assets/audio/Тёплый снегопад.mp3" })
    await ctx.replyWithAudio({ source: "./assets/audio/Уютный вечер.mp3" })

    await ctx.reply("❄️❄️❄️",
        Markup.inlineKeyboard([
            [Markup.button.callback("Вернуться в главное меню ↩️", "start")]])
    )
})


bot.action("Mail-00", async (ctx) => {

    await ctx.answerCbQuery()
    const stage = "Mail-00"
    const user_id = ctx.update.callback_query.from.id
    const dbuser = await User.findOne({ userid: user_id })
    await new Promise(r => setTimeout(r, 600))
    dbuser.stage = "Mail-00"
    await dbuser.save()
    const mess = await Message.findOne({ stage: stage })


    await ctx.replyWithPhoto({ source: "./assets/mail.png" })

    await ctx.reply(mess.message[0], {
        parse_mode: "HTML",
        disable_web_page_preview: true,
        ...Markup.inlineKeyboard([
            [Markup.button.callback("Вернуться в главное меню ↩️", "start")]])
    }
    )
})


bot.action("Couch-00", async (ctx) => {

    await ctx.answerCbQuery()
    const stage = "Couch-00"
    const dbuser = await User.findOne({ userid: ctx.update.callback_query.from.id })
    await new Promise(r => setTimeout(r, 600))
    dbuser.stage = "Couch-00"
    await dbuser.save()

    const mess = await Message.findOne({ stage: stage })

    let i
    if (dbuser.couch == 0) i = 1
    if (dbuser.couch < 5 && dbuser.couch != 0) i = 2
    if (dbuser.couch >= 5) i = 3



    await ctx.replyWithPhoto({ source: "./assets/couch.png" })

    await ctx.reply(mess.message[0], {
        parse_mode: "HTML",
        disable_web_page_preview: true,
        ...Markup.inlineKeyboard([
            [Markup.button.callback(mess.message[i], "Couch-01")],
            [Markup.button.callback("Вернуться в главное меню ↩️", "start")]])
    })
})

bot.action("Couch-01", async (ctx) => {

    await ctx.answerCbQuery()
    const stage = "Couch-01"

    const dbuser = await User.findOne({ userid: ctx.update.callback_query.from.id })
    const mess = await Message.findOne({ stage: stage })
    const mess_arr = dbuser.couchMessage
    await new Promise(r => setTimeout(r, 600))
    dbuser.stage = "Couch-01"
    await dbuser.save()


    if (dbuser.couch < 5) {
        let i = dbuser.couch
        await ctx.reply(mess.message[i], {
            parse_mode: "HTML",
            disable_web_page_preview: true,
            ...Markup.inlineKeyboard([
                [Markup.button.callback("Вернуться в главное меню ↩️", "start")]])
        })
    }
    if (dbuser.couch >= 5) {
        await addText(mess_arr, dbuser.userid)
        await ctx.replyWithPhoto({ source: `./assets/${dbuser.userid}.jpg` })

        //await ctx.reply(`1.${mess_arr[0]}\n2.${mess_arr[1]}\n3.${mess_arr[2]}\n4.${mess_arr[3]}\n5.${mess_arr[4]}`)

        await ctx.reply(mess.message[6], {
            parse_mode: "HTML",
            disable_web_page_preview: true,
            ...Markup.inlineKeyboard([
                [Markup.button.callback("Сбросить свой чек-лист", "Couch-02")],
                [Markup.button.callback("Вернуться в главное меню ↩️", "start")]])
        })
    }
})

bot.action("Couch-02", async (ctx) => {

    await ctx.answerCbQuery()
    let stage = "Couch-00"
    const dbuser = await User.findOne({ userid: ctx.update.callback_query.from.id })
    let mess = await Message.findOne({ stage: stage })
    dbuser.couch = 0
    dbuser.couchMessage = []
    dbuser.save()

    await ctx.reply(mess.message[4], {
        parse_mode: "HTML",
        disable_web_page_preview: true,
        ...Markup.inlineKeyboard([
            [Markup.button.callback("Составить чек-лист", "Couch-01")],
            [Markup.button.callback("Вернуться в главное меню ↩️", "start")]])
    })
})


bot.action("Oracl-00", async (ctx) => {

    await ctx.answerCbQuery()
    const stage = "Oracl-00"
    const mess = await Message.findOne({ stage: "Oracl-00" })
    const dbuser = await User.findOne({ userid: ctx.update.callback_query.from.id })
    await new Promise(r => setTimeout(r, 600))
    dbuser.stage = "Oracl-00"
    await dbuser.save()
    await ctx.replyWithPhoto({ source: "./assets/oracl.png" })
    await ctx.reply(mess.message[0], {
        parse_mode: "HTML",
        disable_web_page_preview: true,
        ...Markup.inlineKeyboard([
            [Markup.button.callback("🔮", "Oracl-01")]])
    })
})

bot.action("Oracl-01", async (ctx) => {
    await ctx.answerCbQuery()
    const stage = "Oracl-00"
    const mess = await Message.findOne({ stage: stage })
    const dbuser = await User.findOne({ userid: ctx.update.callback_query.from.id })
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
    let i = arr[Math.floor(Math.random() * mess.link.length)]
    await new Promise(r => setTimeout(r, 600))
    if (dbuser) {
        dbuser.stage = "Oracl-00"
        await dbuser.save()
    }

    //await ctx.replyWithVideoNote(i, {})

    await ctx.replyWithVideoNote({ source: `./assets/video/oracl/${i}_640x640.mp4` })

    console.log(dbuser.promo)

    if (dbuser.promo == "1") {

        await ctx.reply(mess.message[2], {
            parse_mode: "HTML",
            disable_web_page_preview: true,
            ...Markup.inlineKeyboard([
                [Markup.button.callback("🔮", "Oracl-01")],
                [Markup.button.callback("Вернуться в главное меню ↩️", "start")]])
        })
    }

    if (dbuser.promo == "0") {
        dbuser.promo = 1
        await dbuser.save()
        await ctx.reply(mess.message[1], {
            parse_mode: "HTML",
            disable_web_page_preview: true,
            ...Markup.inlineKeyboard([
                [Markup.button.callback("🔮", "Oracl-01")],
                [Markup.button.callback("Вернуться в главное меню ↩️", "start")]])
        })
    }


})



//Часть с прослушиванием сообщений

//Механика поздравлений
bot.on("voice", async (ctx) => {

    const file_id = ctx.message.voice.file_id
    const user_id = ctx.message.from.id
    const duration = ctx.message.voice.duration
    const dbuser = await User.findOne({ userid: user_id })
    const mess = await Message.findOne({ stage: dbuser.stage })

    if (dbuser.stage == "Mail-00") {
        ctx.deleteMessage()
        if (duration <= 36) {

            dbuser.mail = {
                file_id: file_id,
                user_id: user_id,
                moder: false,
                sends: 0,
                format: "voice",
            }
            await dbuser.save()

            await ctx.replyWithAudio(file_id, {})
            await ctx.reply(mess.message[2], Markup.inlineKeyboard([
                [Markup.button.callback("Отправить", "mail-yes")],
                [Markup.button.callback("Вернуться в главное меню ↩️", "start")]]))
        }
        if (duration > 36) {
            await ctx.replyWithAudio(file_id, {})
            await ctx.reply(mess.message[3], Markup.inlineKeyboard([
                [Markup.button.callback("Вернуться в главное меню ↩️", "start")]]))
        }
    }
})

bot.on("video_note", async (ctx) => {

    const file_id = ctx.message.video_note.file_id
    const user_id = ctx.message.from.id
    const duration = ctx.message.video_note.duration
    const dbuser = await User.findOne({ userid: user_id })
    const mess = await Message.findOne({ stage: dbuser.stage })
    // console.log(ctx)
    if (dbuser.stage == "Mail-00") {
        ctx.deleteMessage()
        if (duration <= 36) {

            dbuser.mail = {
                file_id: file_id,
                user_id: user_id,
                moder: false,
                sends: 0,
                format: "video_note",
            }
            await dbuser.save()

            await ctx.replyWithVideoNote(file_id, {})
            await ctx.reply(mess.message[2], Markup.inlineKeyboard([
                [Markup.button.callback("Отправить", "mail-yes")],
                [Markup.button.callback("Вернуться в главное меню ↩️", "start")]]))
        }
        if (duration > 36) {
            await ctx.replyWithVideoNote(file_id, {})
            await ctx.reply(mess.message[3], Markup.inlineKeyboard([
                [Markup.button.callback("Вернуться в главное меню ↩️", "start")]]))
        }
    }
})

bot.action("mail-yes", async (ctx) => {

    await ctx.answerCbQuery()
    const user_id = ctx.update.callback_query.from.id
    const dbuser = await User.findOne({ userid: user_id })
    const newMail = new Mail(dbuser.mail)
    const mess = await Message.findOne({ stage: dbuser.stage })
    await ctx.editMessageText(mess.message[4])
    //, { user_id: { $ne: user_id } }

    let messUser = false
    let i = 0
    while (!messUser) {
        messUser = await Mail.findOne({ $and: [{ format: newMail.format }, { user_id: { $ne: user_id } }, { moder: true }, { sends: i }] })
        i++
    }
    messUser.sends = i
    let promocode = ""
    await messUser.save()
    await newMail.save()
    dbuser.mail = {}
    await dbuser.save()


    if (dbuser.lspromo == "1") {
        promocode = "Если хотите, можно записать ещё одно поздравление."
    }

    if (dbuser.lspromo == "0") {
        dbuser.lspromo = 1
        await dbuser.save()
        const promols = await Message.findOne({ stage: "promocode" })

        promo = promols.link[0]
        await Message.updateOne({ stage: "promocode" }, { $pop: { link: -1 } })



        promols.save()
        promocode = `Вам ещё одно послание от Самоката!\n\nДарим промокод \`${promo}\` на скидку 15% при заказе от 1000 ₽ в приложении.\nПромокод действует до 11 января 2023 года. Правила акции [здесь.](https://terms.samokat.ru/promo/Snezhnyichatbot.pdf)`
    }

    if (messUser.format == "voice") {

        await ctx.replyWithAudio(messUser.file_id, {})
        ctx.reply(promocode, {
            parse_mode: "markdown", disable_web_page_preview: true,
            ...Markup.inlineKeyboard([
                [Markup.button.callback("Вернуться в главное меню ↩️", "start")]])
        })
    }

    if (messUser.format == "video_note") {

        await ctx.replyWithVideoNote(messUser.file_id, {})
        ctx.reply(promocode, {
            parse_mode: "markdown", disable_web_page_preview: true,
            ...Markup.inlineKeyboard([
                [Markup.button.callback("Вернуться в главное меню ↩️", "start")]])
        })
    }

    if (messUser.format == "text") {

        await ctx.reply(messUser.file_id)
        ctx.reply(promocode, {
            parse_mode: "markdown", disable_web_page_preview: true,
            ...Markup.inlineKeyboard([
                [Markup.button.callback("Вернуться в главное меню ↩️", "start")]])
        })
    }



})
// Часть с модерацией
bot.action("Moder-00", async (ctx) => {
    await ctx.answerCbQuery()

    const user_id = ctx.update.callback_query.from.id
    const moder = await User.findOne({ userid: user_id })
    const content = await Mail.findOne({ moder: false })

    if (!content) ctx.reply("Для вас пока ничего нет)", Markup.inlineKeyboard(
        [Markup.button.callback("Вернуться в главное меню ↩️", "start")]))

    if (content) {
        if (content.format == "voice") {

            await ctx.replyWithAudio(content.file_id, {})
            moder.mail = content.file_id
            moder.save()
            await ctx.reply("Все ок?",
                Markup.inlineKeyboard([
                    [Markup.button.callback("Да", "Moder-yes")],
                    [Markup.button.callback("Нет", "Moder-no")]]))
        }

        if (content.format == "video_note") {

            await ctx.replyWithVideoNote(content.file_id, {})
            moder.mail = content.file_id
            moder.save()
            await ctx.reply("Все ок?",
                Markup.inlineKeyboard([
                    [Markup.button.callback("Да", "Moder-yes")],
                    [Markup.button.callback("Нет", "Moder-no")]]))
        }
        if (content.format == "text") {

            await ctx.reply(content.file_id)
            moder.mail = content.file_id
            moder.save()
            await ctx.reply("Все ок?",
                Markup.inlineKeyboard([
                    [Markup.button.callback("Да", "Moder-yes")],
                    [Markup.button.callback("Нет", "Moder-no")]]))
        }
    }


})

bot.action("Moder-yes", async (ctx) => {
    await ctx.answerCbQuery()
    const user_id = ctx.update.callback_query.from.id
    const moder = await User.findOne({ userid: user_id })
    const content = await Mail.findOne({ file_id: moder.mail })
    content.moder = true
    moder.mail = ""
    await content.save()
    await moder.save()
    await ctx.editMessageText("Следующее?",
        Markup.inlineKeyboard([
            [Markup.button.callback("Да", "Moder-00")],
            [Markup.button.callback("Нет", "start")]]))

})

bot.action("Moder-no", async (ctx) => {
    await ctx.answerCbQuery()
    const user_id = ctx.update.callback_query.from.id
    const moder = await User.findOne({ userid: user_id })
    const content = await Mail.deleteOne({ file_id: moder.mail })
    moder.mail = ""
    //await content.save()
    await moder.save()
    await ctx.editMessageText("Следующее?",
        Markup.inlineKeyboard([
            [Markup.button.callback("Да", "Moder-00")],
            [Markup.button.callback("Нет", "start")]]))

})
const user_arr2 = `485037677
485037677
485037677
485037677
485037677
5416880886`
const user_arr = `485037677
485037677
485037677
485037677
485037677
485037677
1339277938
964388702
962064134
717194125
558779887
1214857852
214224226
217881948
103012308
180823034
663547118
130866565
1772545833
376834724
616791400
151338258
1450235494
221198792
547181670
1997195674
834999849
1026434194
919365384
727761628
1524516736
5200039648
69137762
340526988
586052363
223882204
2035121602
362190479
138776596
217201466
388307027
386871463
396366144
499777547
5154605389
278945369
958247928
39798856
420675020
215813950
308527212
147173897
234261796
430787378
798709288
211837093
819707036
2083251712
1911930520
359556355
241256996
230766975
1064553403
454815249
427887068
2594702
1190727330
200981872
200580007
783158393
931732217
570194098
490164977
1137874501
296537944
360706224
156554238
335802124
1646558788
254169457
339162242
1386371142
271812066
536568741
353184925
282654524
63448805
1658624380
380815992
688827839
130881082
94590542
202953935
779893676
534895114
198410419
214175254
121323037
489630803
181931251
312020957
813681276
127444713
1837773215
453884715
1235675503
373486381
1099758804
204634344
398639419
176672064
120659083
297302320
709586103
871461483
791620687
218386430
522966977
1008801947
203552427
1769773695
415931606
551588587
303913728
152225056
514548094
85733701
951267393
252444546
277370906
371862711
381589701
117041425
1794886790
212538462
315442278
417403013
1163001803
564553070
425678209
464491267
126395673
1678382082
1177275542
414643437
540491200
358230159
29894564
1572464755
358230159
29894564
754950193
295027851
295027851
295027851
586796449
1572464755
1572464755
754950193
498078226
359362818
826058501
411097777
681825714
1437279574
147261663
1308655074
467008390
690966701
529486675
543981677
1124862838
493069841
641789239
512543718
817085149
741209557
917431929
1118551099
743887900
404608063
385704501
259085157
519919526
2019938624
394839282
838695945
354489472
473104036
214200071
726461351
235370589
528932852
429355918
209231032
261785181
614732852
785322254
269090312
308981992
443490298
607238223
234838377
364120165
1027539832
743321336
999286047
239186845
533557015
712347730
1645461418
738257356
310400682
794680709
796330221
427981411
540305741
318741691
923064917
344504843
1317074984
548996044
345276182
2135636170
1980391161
512219769
558899028
1141590392
729176142
835008651
203739714
211041349
71827587
154836875
51737242
262510709
1157771335
485440815
264462982
427905972
1184479937
1258755613
112368602
975699494
512305654
946602089
713943485
476423561
337790739
127317431
735404177
972121809
91966997
372076155
242509419
5253567023
436776320
91016363
1817963022
1315823089
689840725
403244246
5070861924
382122208
427017192
1107579238
179441
1069375892
349057217
996072154
784603874
709520556
251054023
378061697
1756494457
212593568
270811665
269709944
346053515
388461957
804777660
1063758667
708071132
222530031
482990370
370312447
459055588
865573019
5112119641
1013398222
529330431
482713363
5176303593
948082868
850764674
342062516
418346569
1320693007
408309068
1936827146
5271155626
1515507626
1776478032
633923574
1745054125
704659454
949352516
959355120
190452427
674420704
740616437
834881709
690449487
496240394
269309098
549921388
684506657
562398479
267775939
276854282
5068857
696649438
700872496
148104542
572641203
1010563187
394814549
524968948
1055138489
945935246
370715280
835334929
5338871829
878533286
479739572
844987870
507591163
868943488
333897702
1722370893
339470668
394453671
29235657
830632839
1287154855
844382875
192571290
314014992
844451518
171245827
384010911
824806964
5037346289
450790827
5205093661
415187798
668165576
346418328
173902417
543188093
464779299
1876957467
260120211
367563028
906600080
338173793
1641744892
381799593
1259248604
455952632
445570817
1280632360
1046785157
169685090
1161928077
66536985
424680464
1867151175
661936365
321007839
344020604
775476520
5248622286
398629305
180117324
1896993538
815145093
414226632
477027373
1706128506
553748730
641936736
1103482029
518694869
547996830
50350763
332421176
1964820808
747891184
48489965
222208137
383877635
1374465333
810120048
464004151
153385040
275323024
476393093
378944014
820398753
2141285267
1176629716
1159192795
467172335
2050857971
883563186
1115556469
1039527393
315524902
1097057082
901300712
149981211
69726991
298461899
671123129
5147115389
428555188
1239328649
838463702
82742778
4732536
478338842
375965615
1826008070
5152441821
506457425
1287181290
194360936
322003138
959697627
637976950
502345699
383632805
439810699
327264700
411951998
1054844141
1189362306
94560073
1883758321
437635824
95424769
706777340
883059817
16971069
414391759
1032341289
407273288
158305819
241216289
296363533
426834337
172491683
727049906
153682959
355209755
299593725
723816510
1147244758
1411263708
624370488
127150846
817850760
1145504973
357186021
9014210
49262606
196763891
336390321
534991963
211263446
1139458100
288999984
175934924
243732477
172819773
793084633
1075609606
221866224
1223429582
387559349
495641364
377446978
1497514860
401958215
662404774
1842718627
264272653
866492101
129969403
303449314
511617136
353076270
776043699
678774763
258127102
347705014
5037272363
5189372432
479371564
365292193
301906891
201906692
372344754
923605869
1859598802
214588875
227055926
309168853
310628959
431217268
49518235
443147631
407179598
1117281001
60430315
271409227
97450448
182492969
1072329201
517934
434771
455041158
403594226
352317996
385952045
268046257
656042334
498572338
134725709
195048320
259181529
339756042
440314779
368977818
271462677
263009401
922615979
373292347
281475245
791233504
114744687
525779826
964237682
808075501
162692395
153535625
257631725
117955065
123634493
1197950743
252327160
363933411
87569505
95755417
490551135
313755940
150497866
556848603
207190657
752627025
68936814
799115573
63429992
43303600
705563651
326021464
132809002
393987490
279277841
89150915
176668569
559528101
245075392
295542967
378348785
287616109
303797
361338920
1379633746
140058462
202269780
146640760
468317072
440203516
132102759
745436331
5071918931
28640792
289288845
232238306
360163996
264788964
336860198
225939048
994200171
226105017
374968601
461663609
494226640
1044776477
405577191
360286110
950104087
137677993
1286216281
988869772
481871640
228060680
490632835
249291212
135841035
503250177
930818383
608183530
210534101
774011118
405782642
216923110
295467280
253221970
343616608
184071307
79893277
358865841
271926360
159542905
661884636
285662140
569268475
353598009
938242335
275966010
193910357
595590976
1037488737
471716519
319696896
769797247
350563014
825741424
431190938
173928732
219669659
32071692
466821841
240221106
217354328
452302940
135792297
482716435
264642978
404769633
51400890
654946
441959849
1027929210
427910986
557448041
270579539
106335227
141201155
684473784
307976647
1206090207
186015974
71062693
718248469
466217377
103041171
64906623
179748046
1825060032
1364751066
873403398
671609080
518438674
897315347
489543644
139079073
800726860
234771304
72254448
910846207
395434117
260179853
42684879
131481330
167005588
151236405
326266899
133625934
157745719
286119042
141788660
255450333
796485937
90771266
142218661
340991133
461312784
984093315
356368250
256445213
97087116
210688609
172261383
211635476
318235302
75233163
518982352
1306001083
163940786
263779451
197698371
1460580219
359572830
343918254
219902451
1653526975
372825489
370065681
871545036
316992458
245138701
323451131
304444589
217187903
402501621
110201118
554906482
286764019
541274874
598597775
592384359
563652688
454351482
90981724
262231836
216496243
1631104718
744622561
295126682
1826748923
501593780
1426188
133687382
1044806702
242541833
292794901
243451420
305966162
434215331
403529490
5242423629
127127415
452302261
832171212
298785072
48898607
507887582
260997102
785006292
435326608
772179079
384163664
342510717
342284020
560310489
260615097
359675445
399431636
100081403
1041055982
215250425
98648189
168212236
216674257
160051507
125796921
119173676
443180159
396786638
468879076
931151356
491666729
352695779
279673565
104294646
5416880886
243531892
584480359
188158621
462763112
420779991
418330140
711070734
171771977
1261807548
1395854926
325166665
242634157
253536136
396984592
435455791
881865860
263111870
142282454
175438364
243974431
290538
1179218467
257399082
342815404
951960577
262572817
406061997
228330501
259797306
602410584
467065994
846954813
329809399
208668895
493958700
255924791
323133214
339376469
492345695
188649752
289845213
120063050
450177590
1973112908
117368059
453120652
556859402
257170667
134514342
385592178
827450462
69384389
941594641
563406163
335543804
458670861
159221295
735491795
1247030293
152449664
785488845
927019751
80381445
1281042028
264194272
1138281199
861228563
877264056
261196996
356783692
265852232
303194023
494584201
830041235
1044043123
192673989
1987540309
879783213
643163588
499661667
1000386018
817894262
1121477169
481902560
869323032
608175933
503187847
349514096
507996438
490810544
1316946781
1342378067
281900410
373909528
342372931
1129842108
643392534
369526693
807702842
1074899182
562873977
655298996
446133054
237357281
570847030
287421084
135079488
227130369
48650821
186676974
80862052
1281898216
390939779
303913955
758353738
363254134
443321837
305093550
469205598
416505475
1912061316
905165996
363053235
420505760
290011003
461362337
1037507067
201055052
733277659
882558044
262568942
826240182
677513915
318161154
393472014
375334439
837820641
909908600
5260186837
56008747
434458533
287498442
896604920
120046388
155861051
231096119
201256364
660980320
832438291
254633968
216116752
228306534
1186373978
379443432
37611766
274734299
236681715
532562509
248591539
243435613
858628617
356442335
576064322
829266480
836885270
270606221
1012311706
547083522
391914655
115145616
258395497
334253403
395714564
858285116
1812556847
563074892
258473252
911055063
528961507
424238288
365121230
222482545
265336710
163582135
543777110
433345405
884755737
442004231
114798600
833783167
357544605
298833777
709531906
652213075
2998297
635827017
266847550
82915342
1018513977
479174034
546580613
460528334
419562227
948712631
532734415
142455958
302821306
908963600
231705225
998873238
120544793
1787338018
847599682
933362474
482732314
913809960
87232447
1028267806
1310222382
386959740
7329502
1560007666
308965804
429986058
661266291
961213680
637459445
1320236581
471641120
159585513
1066455195
706878435
1316425673
779446221
36431687
657925232
500762986
90941857
252986650
104457952
1148263150
296966810
383122873
359336284
348697508
756874979
225250629
598220115
762907593
368865100
922458781
331323612
193795764
757882527
332183319
259084325
457286862
1404795599
136640124
456766108
511510176
244492454
315311444
712648289
5046778968
774119052
827288788
995798888
272686679
368443443
332313829
137596505
708053777
177062082
718111214
633452273
173405997
795378
394899453
838544032
1043522393
602784494
1480285495
243512703
857052338
215259772
1960925874
814843097
806358477
1190000366
479172653
228163768
814450986
838441385
300903843
804766789
377256570
325285359
429255356
165704959
1083685793
852950882
308410771
1149383891
280071726
549392820
982372495
765141197
805557703
954166194
199951545
467638806
303011111
1335123584
250864902
5244860859
356488448
971747105
435660673
551777691
719189911
708139570
854793555
838222696
270739180
437336608
495431932
754067120
860029679
461281008
5230256608
162895356
1217436734
17596
524289229
409280963
426743367
47740153
37595687
155146890
5158033076
234034864
332959961
1016499468
526645596
405337607
335025152
508104989
1032285361
228080841
424197464
406657970
5247169361
660362
377306763
356697386
215155901
951856593
209131937
749328549
386085677
659916024
327135287
659212235
504926583
947423193
547395073
1064206300
117682349
452492125
96901549
922981719
312623869
1014496071
1002586123
138760359
436693260
208602959
132218300
380997206
412742962
265279422
1337229221
209584251
174343279
201412325
44005922
383272711
532592655
53363182
894335913
192699529
200400
824245647
532852224
1032846495
547869228
725746873
170829630
1034791534
324563995
1409290122
258913737
548658910
271341062
280012459
464337633
80383898
405216421
149188196
548204792
250080291
905973620
478519911
153496392
392232942
90435207
353654329
406903873
685363228
424367491
407520036
254393004
461096346
373816194
214749901
223363006
345322837
1414566464
119863590
761021355
382614170
506914719
288707758
1165003414
254487893
310038798
446024941
89109149
903365442
336399075
733586
108992997
695332693
312195013
486339257
1067487026
488111788
1266773211
165205237
702087545
353166194
493987501
287711470
784483045
1390268151
932528764
821363768
784554710
455355086
958113131
465257621
1055363931
805484749
226737684
725680948
1993508629
229870702
815687167
417581011
1343358924
1107483771
295209496
403207276
457786106
447982300
173709582
56758272
253250594
744754867
445305150
658652272
1411825272
626183173
500136416
505825703
890005659
393172545
982947723
1025813927
364234889
284517818
951426433
435905878
362081465
278291494
376021214
421210720
961878113
818725495
1263966264
457846474
677441828
53553136
964955989
833638197
325708601
759017548
914514893
5198065300
5250764217
398632629
1060579905
833651574
391820234
371311730
251221246
445657747
1282839516
402243772
935565067
762605349
1291466376
96043528
1080170444
513459176
1693467059
462663879
508014413
1384324918
2029149060
435076454
1987884328
800258066
899408466
738081176
888580851
814397825
381833654
144907051
728381672
491848558
1347613985
570645392
880689269
792870789
507061582
140905754
1319185691
1781154668
109473544
375082538
522577210
809067718
42018565
251067215
66584735
886885187
361058026
296083613
5147645542
447076531
1295679283
537892240
977023914
1339881359
152602569
514985631
54071997
1082577549
102775626
881854157
228011360
296522306
839559605
516371705
1090100898
751285285
432548064
126501724
374164405
116660756
764840815
213868168
1348256023
710913215
157413604
363527612
766363
457060356
143495919
491591246
1683707417
818955552
288306864
1314761092
310333221
378260272
1268076893
682548082
635934216
823314838
70673741
770326211
401712068
226499994
266227993
595921057
1468125299
433618326
485437314
359373533
321766603
1120183459
532598745
441851685
333618713
372190821
180492698
279387517
160736046
1528674975
346608861
506800820
362202208
2028997682
963535150
320130978
873978572
1020627676
163451534
530314737
1018784266
934770459
1142121198
375798785
181049400
1456383889
296850459
1375132226
227161138
478081599
478353085
408509728
120203898
31615604
803658710
488730191
478483154
505809160
355517019
1108454934
915874729
817848534
330619491
270626152
543882519
448752272
168730884
55381486
201472064
170549205
2040040106
131031814
347249213
273611849
421013076
965213633
658195991
268381439
238660189
284836
890408120
416733266
437668700
493243422
512670120
207815601
874861605
277418750
393350777
390604371
145735608
798158701
190767670
130291157
91024608
404864450
232500514
642477128
753796502
387583149
87120924
522885045
717832309
679781812
1034947330
395208550
65434089
1169655009
518075225
887203619
1524034377
1142210794
1487340307
1922554541
303751293
848370057
568905193
168201593
478454075
513342615
239762024
647041550
1322232345
1423181145
1063837986
791299902
118648880
739040990
754770071
1020064382
465029416
722645888
1750999508
537649830
889794113
1420100834
801501704
1098605656
884877166
452107001
36983349
396098101
246689749
844216916
861635811
1355571655
722538024
1017189898
1390238828
775224242
1062534102
211997859
983457598
797350793
300707543
681395819
955482199
916752811
382552558
651621638
392446999
1198745727
979619876
436033756
742067486
1849209155
156683771
195140234
215379976
484195816
890674453
708979978
1060131092
1439275405
286725395
247987358
5211030202
168144838
222595937
918985163
249748558
1669399117
434631457
136518285
707091386
391464504
163450138
541522974
526740259
374509495
333124841
281831801
425500993
707203269
438288834
557311979
390568940
185234762
100757023
1062887130
189413407
188260970
148537494
748068175
450437609
1021464855
477156525
535366957
372949093
1098817533
423764959
444952933
836668914
1349862621
665060317
428512499
1819671920
756396737
632643360
266421168
1006901963
440177459
957863373
1154766265
430787904
810506149
262169385
497089252
177200713
1019701528
545577017
1010118704
1125617619
477499137
736619294
591214687
227032064
509382841
1741691420
404288350
236749340
137801684
554948846
302355208
276757097
527594455
647262975
301218631
408992566
243075160
697851046
1032987261
1497501653
699909734
854302252
1081396010
254921263
477215652
386296046
752400415
1867592911
247359346
313242665
1119400260
859031827
436016436
233230207
851751502
899228621
325002948
983440691
814792272
285849
356203905
647734831
365312735
261730041
852330341
231151307
443983437
144065137
808073266
136579955
148379405
538380394
991585967
324067265
160534236
798006098
930298284
407532212
5212158611
173831704
209725898
214743736
391301277
890967341
1009013745
1025480778
257395205
745598803
241795124
336189766
390538445
1017723780
416507174
243060060
424245438
34890713
149197413
399461239
1039791638
127121157
342109994
86434083
508546855
528006979
443591824
145956307
997853737
265157273
300740832
59689861
275123168
5214854618
363297194
274338537
466212486
262682447
422324785
151151729
313371098
456459969
446331830
1535212054
327890221
1415399123
823948541
324390331
522405349
332348904
190738609
986884670
366789659
1228493821
849079392
1187322803
270411003
171035816
657831438
1246898997
763854720
69887725
438219360
487089818
138523828
414106535
1080818
404166134
737248479
258712497
192497308
416761268
352004408
949289497
270713713
784368993
863610380
466304663
820169228
884614015
347894001
708615760
202717042
593148766
354377452
683965865
743276097
271991622
278785803
94788941
261720025
805435710
236471724
148542140
1341957904
234074591
290602795
335127578
207084395
336437198
1152881684
52164356
1103070814
974490
742794686
1760309907
318429415
244323293
760095250
57532569
288902430
1297076522
192940751
582141579
208889782
339583358
562046891
1011579437
208849076
272655658
387095081
658702757
415806384
5471771280
257573785
462106841
881569557
5412952249
375946070
303818289
237205136
273371358
515119509
269780420
550555961
301099964
44837203
206204379
775813313
459256943
898328246
468866260
351193687
686709939
261841285
343510098
324309106
488055737
231279090
288497879
648911960
92144703
1472897061
1668639412
661123513
838614713
84980993
1158882971
1525231451
662321269
1231420076
1275823068
236810891
544939789
913436063
5442120885
437772514
433129715
5166233936
312498932
5005850483
206104115
398307747
752942565
524932352
1042163442
905530207
1029740523
295607971
48801983
1019610331
481898057
593214868
873162105
304029406
774499436
376055994
863000212
729438796
351175406
166370014
339545322
264218235
299791449
319895007
936621166
542395970
859888128
127425552
900462
5292673440
420903718
756133813
103651349
366434270
413318157
375445533
487906113
1820609390
381579067
731059807
1084769990
781850898
587464435
248872100
744206
1342189454
360618609
1167309649
735139650
862664223
566863254
363932854
301300209
218904044
832406070
455847620
1124106450
1059470783
2078721337
199241739
327881770
770055568
195231190
311074514
1549922
324320498
337596875
816974856
1242492758
710686100
293957896
502114218
418820894
429483023
1001186216
143722933
1936301739
1769138870
5194811157
769612220
942488898
433440145
374158299
199222524
832851352
813065028
900466883
99669357
224133988
331489791
754645371
742331959
329657557
572811757
426684756
909008362
569619705
1210675863
376383276
339262321
362318186
372385738
425796201
651773132
242564374
184892175
798729980
263959196
361590917
906279939
661940147
816161657
774357418
726229224
89188496
499822672
373622109
652469062
489442591
353236574
443332617
1360529028
1371457519
1212059580
5337946221
715671937
333433291
599398007
275355738
1342684156
1652771587
1204599559
437167163
92451699
783636658
890728127
495841838
448412154
401708467
415926768
496710991
1081834163
344664315
923184578
1776890043
96326378
370860409
477060265
991586957
751401288
378903605
482653149
1609132316
744871114
1839043403
67329867
455597938
318312768
396078567
362305608
497059626
249318034
1304947703
213926842
1133183026
315389879
256668815
745433245
200216420
812296711
309086723
380821284
212273828
506655850
351903490
1217787683
125451652
38688169
1157367897
250755562
952590707
445782050
5053859638
187665024
981199666
228927337
486360503
960021252
1322611105
409438046
365210653
240295313
1020662143
829574462
130135
1139317148
768886890
731809966
257480310
701947969
342141769
702110690
625142589
297156064
289954588
1810430328
262168531
404138123
538355724
207067536
255326530
240246617
280269327
438946100
448609935
159490832
1278249577
544412682
103473717
130462537
60700841
1322406586
991835169
416409712
1069524102
515298020
286907843
914093470
930461758
90834890
1103557508
934438674
838865200
122686295
127371462
607188204
1154595911
221476468
469805062
242713453
989744063
496064261
1613480423
317748779
64362729
412738664
675776955
363871369
336618857
371212
2073012929
287701630
413600250
507310898
801344176
378405107
335467370
935045557
591809275
939106560
840614983
327168429
92874256
890732314
498480912
120613850
549231900
1261423773
133644334
254942236
393027991
281734113
391701862
825731385
1264940456
310214343
5070298543
870098911
1188928212
457234555
167211451
539718643
443911668
611478360
244257926
1540955588
514660759
130017023
155182790
361926727
304368471
485624886
920298499
411566323
446204868
503189070
732320132
672340465
800342065
173381983
508707827
570457616
519661716
928806562
214622478
292936720
1213629908
802709358
322751830
108749609
277133961
321100795
880129704
897000583
214281028
372042374
175930754
971106040
1046121410
472496007
209988037
690215457
477433571
350609094
180963795
340249880
469978921
241473850
355097628
442755189
297277544
744354903
263172788
165754508
750077343
1425982712
152554069
989155758
1002826043
388206559
418307185
179932247
554595837
367380262
122660363
1330344881
304463483
868505580
676841368
227238556
1031752337
35326835
168512636
1357483275
748906411
452707821
306457095
95077725
255490025
423399933
578937596
21624814
848694729
332778691
511630652
483810707
259119511
323359596
169080805
1348135854
485283240
753236155
831946328
262119553
358517932
785699240
892075578
323953634
434016015
972761766
494660981
311180992
293261525
322929601
718246299
703012990
1166215307
2329936
334824667
418226274
880881651
434035193
611070616
1023379424
779858195
1318966794
1403774977
651955761
288724281
153081625
69894092
1343813174
230983944
772474678
1251670446
177090847
466429731
488675201
488179949
592200987
518851343
905986135
241516661
236880519
412033115
266353652
237841369
54046757
712273652
775587935
438088559
446612481
1821605491
780314898
282194321
915924622
555523228
383633509
1395149162
166650372
767075755
449538532
516536126
910082458
39128582
62302251
790129085
750437882
735298779
637465410
794886659
32601705
409785831
1478458979
125660048
186932783
303889206
327712840
574177936
1187465783
888742888
364113713
774312249
897527637
1035101717
183718881
472190469
1093718756
130423169
489039502
1462219063
326416530
527818574
723280291
686625315
259415692
140976444
1016380523
447388725
1681440637
1026665529
378488595
1068394420
2026280958
1662533750
1665645690
468950988
625835779
648347975
468753081
421105171
306440025
568775928
511887481
715549015
569986937
154246802
255066780
1104805886
372182166
136562958
859322318
1502306618
42307169
498878488
1275950566
2581707
413379131
612753393
293534633
158486676
267905009
113103257
1022538022
504110173
665701497
785175534
350720833
300960714
368474428
230237663
672229110
494919459
425814815
517784118
118166378
884426112
732077992
169644584
531357772
285801676
666421053
832095686
780556092
794211631
321473926
635414720
977109
928503452
771120629
912935848
532600606
37718820
247362111
509674567
288709047
76391412
181576641
561051521
253975047
1230918441
772430560
106791887
186371299
996345281
450733845
729238742
460145961
196979173
413837661
1155787992
643970995
664417638
1514754171
549130638
958378441
2007493354
641997097
433845822
948874442
93695116
419592238
2109419048
1413234207
365780781
926466165
908947020
430369854
5506210740
1849272645
377091485
142778277
947769254
641412099
106344223
761281073
264290836
341333741
360832479
422771181
422771181
555490965
1990509707
283838199
61855011
485037677
837301426
1923861186
303378093
318457784
365633532
946478745
502035353
630592073
534475519
348774455
83925150
1177108222
520338658
192325549
384556847
750744905
446188628
167757746
733874944
881209361
762519822
688262234
527621933
571868085
887758684
673198328
95579526
430875924
661158306
654905636
592907222
970966744
5110148178
203836414
323837040
662848610
78852037
446057451
306914403
217522655
1142762470
152794176
309568788
885700792
416811055
152685975
1797444634
1369585386
764394215
893824505
777466394
856083567
240282345
1551465843
874169767
1218228420
429906492
488453260
187104444
780710624
451608626
762605688
385013936
63974985
410877819
274683709
345699193
260174902
191174806
544886094
402481940
335491577
801668
442670913
710842028
873862479
791492974
445336157
539548206
379074549
371360867
376581502
436332047
709537348
800589627
358898697
282533554
555252947
485001932
267139831
186857867
399849403
409897900
240041954
644738682
1391748351
960690175
347607398
913765492
261350382
2114858425
1702221711
888302250
365309575
159447793
634720357
254275469
241758360
795535682
380356685
647331393
245806857
155486298
262037350
894778254
205130413
1799447198
344868406
487471973
401635821
171844488
466274247
722208873
25905542
905433205
883498897
312166848
1025538984
656273708
1219642813
5581176408
1297276729
450470236
501790411
1898745075
41786779
249584491
635144151
850797800
405890867
184746520
612847158
77172181
516364546
410192019
376363464
189934198
432874246
1005119977
839669673
637904704
483729878
166849522
1018714966
435607072
5394182401
1556719223
333142545
468991069
879125365
259827356
133674453
1480435406
239217648
423191838
245573903
1002147318
376810675
741745215
777210886
336290481
512865685
419836099
332141129
150144637
305930532
1475609073
671979273
864849336
358791963
1207444868
534305461
691969215
790045510
402491872
249951010
5192633396
66956762
210801977
770260235
297393965
443135119
791978174
1886776621
501145889
417626382
1326461591
180605029
585369005
338622999
172916008
406400801
202207183
421615058
654044953
194612616
980181800
87290573
509411007
360692336
1019415937
476643285
765890531
409084353
250754549
139010354
1379489021
290283825
88522187
5099071551
380243557
334165706
486430987
587732363
191182861
235836300
72801463
116683976
494477695
142517787
273960087
928881956
667080193
756503744
1478474057
743949597
348740843
1069335579
954518327
1027756825
884287773
49674918
561560103
462528623
214803218
310136161
1199846762
908484854
210448432
579577046
1127942450
1274898959
126386459
456684384
405394494
259156763
1197050420
1248106812
353391189
207185829
758998074
180110252
572594383
352925584
90136602
1114986778
961136677
1095264859
1821540949
345121516
648624023
754767622
474561473
296283501
920288059
429345315
799196471
140930142
289452286
1072686074
429604165
397677447
1450256131
362882209
572198933
1089557455
5199138657
387600030
695941471
424416554
1007758512
505619289
335067838
932516769
412000419
352901641
820113614
679261613
203913355
935972529
1183370613
779205593
382466047
1238902653
901632165
388248845
317225884
633345366
940497317
1035646137
352134295
643315852
283699893
270346180
821615990
231692505
475042198
425934045
159040082
980815792
1024919739
338268400
265370623
1049243620
239572978
1608224054
221044965
1020481646
554699376
491934586
6058070
641671374
512849975
145776808
1435649988
209786542
1285820882
714850319
871942356
396365975
43854023
403821476
357814093
1534757512
656458684
196409868
243550219
100228756
5104781734
630123924
56724301
831531486
239077191
1018584144
673996537
547267083
914485039
56737343
5882175
210615343
741307105
775572921
832212991
1036327690
222410937
278951112
838123575
248054861
652995359
140009542
467722954
1390458848
1817447706
703292165
1100706145
690874958
1063162193
806500788
457479821
275376068
631827805
297072667
221435495
777281017
811028893
500032364
295438495
539462852
675384137
190557949
391610404
1709415220
325946293
1128010205
164798364
70006246
451862207
561862268
366392662
192279685
913029908
908404833
280099616
723368329
1271025824
393524851
508101201
214445332
555079967
793716166
912647406
30932331
428214147
359298021
823793119
356781740
388206660
1107562320
84483239
525128381
710072961
1390609205
1927235766
1029793318
272784620
883488884
1289681438
1044553171
263096645
785788593
383099960
547299317
156432263
382381291
764131943
628584908
465505026
741345595
750052129
1316937963
429157031
637127634
370691450
433276168
65668826
456062770
59270984
1028475
346310406
386979133
878874507
669166114
922874365
164247823
1591913862
48942083
544569923
1216105104
288882429
336078756
183055606
219243127
854358093
649234449
201880851
370231588
181087707
651014843
471677747
395058694
809690838
323719748
717451072
509515324
1269458802
593971594
868917232
2127730189
131092365
111276027
214364071
339922894
450763269
743991796
427718518
431459316
173192981
399854310
429587089
1539767769
917779820
219490117
1121496344
469954144
89153267
152057637
364922691
49698363
1319511275
54179420
1526042776
768118027
922476983
99362072
634087286
455092046
53820144
216615256
547654135
806700871
545432886
532904302
498815910
746496042
888636133
972401674
779089463
151142031
314791088
1107491299
492811972
438387788
604403296
242979356
1879518667
5190756631
850726608
694217184
1340954197
1274574212
415295853
410416688
740640624
600625001
1376404600
419360636
784561160
822472244
378992992
1603991493
733820604
455924551
1269813276
546927183
755333424
843843832
1045902860
664064495
953201710
128294522
996739825
1114932464
1093325839
1685900279
420076676
717477325
1163535587
810944199
1266572
469809025
223870770
1271033896
457797563
383293095
628232051
749431287
1032688022
150301077
674565262
398497168
5614878015
536583163
1339072925
160638823
97009129
453808293
254609992
647744091
389465614
888934226
1246166947
680333403
1200826582
865250360
1509635867
496973436
532026823
230788082
259786706
385583471
435390305
297476121
729546058
977587969
1427506941
333729965
5212958287
1097020757
1056155379
541654536
314881318
322952579
843524336
467773806
838180150
435440194
250982323
396056345
475158851
1134493449
786523089
763730473
77363009
511554556
955370546
1403531151
133763956
159205451
5055716125
555050139
237655209
269873032
916117619
437953463
1411263708
632317294
212830874
102175003
882344829
1738439463
63985844
666260765
1286715489
540582062
901399020
748506848
549883457
792752265
926272761
307353190
1658263140
603566860
693439247
635552266
692605060
200309779
1052438728
612374201
1011697851
838734478
794391771
282149804
1669944548
691182820
358154711
678125754
955534475
1235633442
539277469
1333236993
220708720
490881116
1190526893
842250925
5253290796
1952397873
505745625
326968255
838091156
297167196
648944081
773871940
570570117
240738011
230953652
714586750
268320742
841582565
350835697
480814685
635479650
477963396
873658185
2039914322
2142081488
966014828
484238908
312612513
628013374
795828228
1135063192
181122985
1184110164
760651948
518045559
1674090459
834168515
239507293
302182867
580430100
357604576
343232323
264693706
82107996
478201866
794193695
646700818
507160435
5192951583
1707366919
362926492
1058422377
71105954
250904615
2017775509
280378360
228260548
368753421
495032173
415456351
1312289890
410369411
611679623
1354326753
187024790
892497529
1598671684
1526308043
241732647
411090670
775504546
318585635
717030385
416337381
1012108941
300924981
358129111
203908618
496434456
697140633
260005782
217096584
87954317
138472348
378468064
1765742953
395930348
393429617
707342562
511424113
432193034
496793503
195010908
385171544
628246068
246772365
71229068
454846547
657739346
125763579
740068916
1440810170
389012761
520191220
93530107
1440506632
306471972
524663136
309277964
473726202
417442377
506457425
425482446
231272871
1115611796
882563448
727040098
743135854
470402964
268660610
1223110521
109279949
249651373
1146645435
1009461937
1395341144
799262490
897020934
929352868
228505273
186169142
586244914
1880822882
540160984
2832815
456359207
405805432
729414704
100871932
80784741
787258110
962110389
599789283
733420541
371861386
465750833
673531437
332391608
206149021
837688017
446481136
1478317627
364313631
81708971
1990141843
499124069
359721939
481385575
1095117178
770566706
427861188
357631091
367622072
1762549254
326132865
926564103
258914765
253290900
267170009
959754171
841769835
892834272
338380238
5199442233
37251207
439500029
318716754
502863565
449265104
1424934627
733246892
916404627
720203819
446585753
553366900
62872492
377153674
365589755
128493822
5208694855
23970918
344859631
83960407
448008014
503550399
516486616
1060595702
292972658
658113971
955764816
324541600
470098484
389689223
53691930
465397594
34705544
227567419
1448804815
893519530
849909984
955890731
204882434
821126364
1005792846
5281065705
103698315
440412979
980173367
438146478
329632528
1014331727
489240714
28327
384512415
11145930
1135090842
217236899
838217935
356991014
364636133
101986298
174355538
401465201
847488613
122341792
316777419
1092602883
358300769
1209483980
396746496
474439295
1055559049
489632478
856706506
242288655
73300801
354542006
527606092
831633638
310041205
298070372
509510693
1173827327
691525687
25195595
146961036
124631321
1397041542
531302716
233246146
300895544
376151116
1898283212
442164345
349922670
129205201
971620277
386896039
378876613
633644055
754721319
596398213
406700008
387181023
332755719
349459863
1349227874
406650439
663870790
428620305
229132785
419028689
499253497
625670359
728532897
201247195
341265471
136427762
578817407
375097838
254004834
282846265
1961080218
531205482
489818352
937277772
949937298
206556154
435395259
1173270543
289629892
140964703
699585200
1136340746
803458208
204047110
247755276
178778924
361635631
805348454
309662465
450674638
416373702
757789211
473433181
75749706
1478615205
5338707321
791575755
322452594
869743519
60116533
119555307
209121457
344961846
516997375
756567337
862857069
738376174
568897038
500243581
1092717095
903480232
2002788594
5225776248
837594474
84952558
263346386
447947728
186038876
318228269
1323571583
313000667
370288615
663094085
5234058307
774167529
1522768497
112097727
1632524913
1225459690
505980125
591701584
530131611
522782356
101920724
232861322
1079788741
361868670
709441040
270205556
519219276
711051918
133804802
1415085199
295641623
315435574
1102511776
917516628
346969054
549447810
324337054
638558804
467484786
521567087
703443935
1532814877
175848240
302898534
1272199353
288928131
709796706
1376063160
828138181
839608637
508765326
34276040
264185592
5560655568
1939858325
282678728
723545159
345227526
633999453
129072816
1446275641
349739933
449806894
867809845
667484957
745309531
392508206
852324027
1897942895
1064401653
533656919
310536341
129951922
511059550
274664931
911383683
918838695
275814372
854195342
669894786
793093889
274559595
221866609
688411370
358758183
413451410
817822047
213780022
1405069860
818001408
483205440
411287088
276118684
301332798
196799967
472862925
469792965
1115744942
219006753
57664528
1539852044
377933829
470716101
1478392660
636903750
1566971098
250702855
336338623
628611243
53599376
423059179
777688461
1378061426
193212716
500991341
504296459
172599937
331975235
215866657
380812436
181581442
503647510
976037430
729740622
105714620
201455762
698856703
433003574
448606514
1268357059
789842197
266799642
78412708
817003139
196729433
137905218
360468723
11614547
339110988
550356409
262173916
539652167
827138585
219805627
427242551
113433167
1039414100
888959927
1148322682
281401375
379155572
669707083
365935562
442313933
512606663
362826725
555151526
481877262
101928834
546397
256310318
823420695
205841270
285511340
917977127
675391
50596046
577234268
5015839995
154839039
907571218
255334773
1075096540
443838915
782888063
199930746
1204854787
5146756243
296145341
773678855
5116329439
381607677
133351047
1710434712
299445856
1101256401
451995245
422969049
1656791579
1061201876
1033732282
198738871
167833708
434462240
149355986
1110970664
309407770
469634514
494141564
349839923
560777537
521086877
813162177
816027892
773115644
131244317
476804094
441925264
1887089123
464254069
210540992
1087017288
887741532
282463145
809624042
960317158
828097523
333439881
785740429
5132635345
352974448
1035985017
362345990
430284464
205757588
651870572
772070984
102084578
45383951
302147621
839442083
294196645
63030497
254317849
304580
121222147
1353340147
639633735
1821259529
983987659
151066856
1868799810
440244838
761146059
580741405
652901797
40410643
305581698
1002928198
227874598
211855883
766420057
1317142756
180330272
531785709
150596739
822747113
833367116
439318850
559610833
466673668
890021485
938510070
498169916
1008518764
45515827
543192223
899464
1785885634
528352021
1042968823
439168678
853163614
160013681
1098990063
5201872894
1091856564
242161569
167559082
203094719
307168097
310226457
252617154
385656270
183522487
751155698
169834301
311756565
870119221
302123688
387306417
765046786
5577456799
462432234
451346368
1222700749
529532430
817436070
608035894
639944226
705259475
1256014521
872928504
437674815
535775
757786353
743174732
1018723539
1329116303
386511074
126826302
165817246
275942029
1926286481
820746015
234883854
1033720685
447749221
536989658
431241177
189624243
494589426
1171708383
398515915
1383712242
345917119
483526751
385016070
435561679
731435587
170505014
115319514
94152902
224051588
1004362966
380392288
619613636
864990640
1471368770
510643507
645922936
622791682
506374452
777870842
244783635
671343031
260879597
547069778
496517965
1232792233
2142038919
373624187
318065337
781909610
941171711
241625688
413231932
304205997
649976676
179310025
284065031
468801101
330927096
338111006
946578
532171704
659103608
333193362
466893478
247578249
392778922
1289359115
290179288
1290917422
202038770
1125059798
308288646
229584231
419599731
648258339
1919595119
664152652
1111485016
1722114642
298810941
1870850264
679440903
615928793
342455448
1072139512
1310837760
1987283347
463105471
108016
2125153173
224841863
419562963
1046564515
522908133
431709979
873407856
99825461
705151100
48250894
432481687
473617082
822160964
534297701
628386378
631851698
1858252111
310843947
253992795
331047307
762647623
997674102
756688111
277275080
197448820
396524572
872205373
435657068
683657620
182752619
113225107
1984061826
576107687
160734271
1715934065
702670542
807686022
5167582754
360199043
806910430
779256445
342755127
1269949152
235057036
1405892084
545541173
1971699641
980755948
872867554
403546412
433202417
235905730
1236814005
389793602
882521155
141184571
430016929
371488476
308503915
452763626
169143027
503069636
414630526
476949018
461172252
270111817
413879433
311271546
1248360305
322213967
1946597591
1990449554
1023602199
979895362
1348761115
444417745
456486802
434228389
356779439
465711304
359105053
77762002
249970266
266930062
477802488
1613480423
527992483
440012906
1097024181
2127895475
432231500
271081982
489053758
369816780
53192997
684926231
747233333
864548244
708437582
54393983
477331315
913692463
994402264
1122814831
1213930843
903136671
467527836
1242327484
535229272
1043594588
451545698
650383064
75689495
26445289
397101687
218874768
381695434
32055954
100192506
311258116
1124658735
70114184
230394949
859837911
1074165609
147124723
511907862
492558998
255333101
339898462
750436266
915415775
542427135
342013925
729244276
1346304366
197992843
496950351
175093912
223225548
1789641916
382832638
1179836502
347651704
525148699
126220531
71469716
716274103
339748117
453023578
656642562
404388344
353092173
1281643944
408065768
1140245528
908318082
831977765
466567737
328245416
338689737
948334628
1358111025
107380033
30930712
110333042
437246226
395854663
424117715
734460462
472057037
84486751
753384885
224219036
321532559
376396722
485976499
974501866
953684402
1021764147
5112452499
524638528
700388864
182520843
824675644
306353556
457321884
1108512466
503052635
491164482
890604790
350106929
274285129
801582433
1184074769
188331588
1649962160
923851329
467925538
44153785
321139098
1749591312
387607603
748980775
238068697
240390020
1133445314
1371769425
1234305890
111027615
864755308
622339940
635184711
617215574
407533323
120976344
230124571
409227154
418040727
924152921
287797324
1066063268
491809812
1525283915
692601489
371796918
701709856
303746151
183190542
287641607
441714504
438463598
181695869
538561869
1406555151
755860758
1767979932
1859262202
511486840
231838379
1167310881
841710422
637316848
899635962
380458815
459505945
678080938
550126630
1872693336
628232051
110452687
474946568
144020080
2033389743
589907125
1106693321
1715452418
416792864
216142132
432236715
754694
112494838
1081085717
272105341
442325979
384525200
247575162
333811639
1060911280
191645084
680521437
879641476
1150350863
550715744
5787320060
800748430
940620862
1036699222
139993147
1095228889
606361297
783083263
296098624
310777552
65805748
1591556999
5129815641
1397494335
466983122
998131261
76785762
788484050
919569186
378682408
1697184496
5322979563
623643208
641303863
132528093
226983176
898839782
438185619
1146438879
1216332641
491230337
1050366092
521079064
252830503
288505212
1010930152
686520463
1748466847
210243808
213205296
1061582035
524944329
1692553500
671059852
652385932
949718036
254361633
314342062
219798252
190276623
736616123
1019938238
804730136
644822759
546495170
2014704491
1952827239
1275569455
258237826
804562539
987127045
325146267
727113495
1998002715
847829673
964833739
27666
394554254
324066887
421130922
937756443
457137839
370068520
159122104
477098186
1005068509
959248729
894797521
477208225
885705849
385592178
851988693
503531913
933829428
530344398
867626960
1322905920
965270441
711117347
602926195
5664017738
239293526
302252367
626183173
2396040
655190440
1217754428
773638470
520711822
389353189
513637981
143632969
278395971
824080664
1573051930
1003596632
856287609
450130946
815865249
177491070
44129256
844516684
1018244996
154453405
481996665
546580613
658888424
720087246
923064917
387870123
1424316327
639039265
1465964332
933192844
336636807
688819207
5713763150
324328365
215762913
1418110427`
//Механика чек-лист
bot.hears("1c2a3b4d", async (ctx) => {
    console.log("adssad")
    const dbuser = await User.findOne({ userid: ctx.message.from.id })
    if (dbuser.userid == "485037677") {

        let use_arr = user_arr.split('\n')
        let test_arr = [485037677, 485037677, 485037677, 485037677, 485037677]
        for (let i = 0; i < use_arr.length; i++) {
            let message_mail = `https://api.telegram.org/bot5413807390:AAGkReqqF9jUNk-UADIgWube5_qW22PrpSc/sendMessage?chat_id=${use_arr[i]}&text=Привет! Круиз по Волге давно завершился, но мы подготовили для вас новое путешествие. Отправимся в волшебный мир добра! Хотите с нами?\nНажмите /start слева от строки ввода, чтобы начать ⬇️`
            let messageURI = encodeURI(message_mail)
            fetch(messageURI)
            console.log(use_arr[i])
        }




        console.log("OK")
    }
})

bot.on("message", async (ctx) => {

    // await ctx.reply(
    //     "фывфыв `ototo` фыв фыв [ссылка](http://yandex.ru)",

    //     { parse_mode: 'MARKDOWN', disable_web_page_preview: true }

    // );



    const dbuser = await User.findOne({ userid: ctx.message.from.id })
    await new Promise(r => setTimeout(r, 600))
    const mess = await Message.findOne({ stage: dbuser.stage })


    if (dbuser.stage == "Couch-01") {

        if (dbuser.couch <= 4 && dbuser.couchMessage.length < 5) {

            dbuser.couch = dbuser.couch + 1
            dbuser.couchMessage.push(ctx.message.text)
            await dbuser.save()

            if (dbuser.couch == 5 && dbuser.couchMessage.length == 5) {

                let mess_arr = dbuser.couchMessage

                addText(mess_arr, dbuser.userid)
                await new Promise(r => setTimeout(r, 1500))
                ctx.replyWithPhoto({ source: `./assets/${dbuser.userid}.jpg` })


                dbuser.couch = dbuser.couch + 1
                await dbuser.save()
            }

            await new Promise(r => setTimeout(r, 600))
            ctx.reply(mess.message[dbuser.couch], {
                parse_mode: "HTML",
                disable_web_page_preview: true,
                ...Markup.inlineKeyboard([
                    [Markup.button.callback("Вернуться в главное меню ↩️", "start")]])
            })

        }
    }

    if (dbuser.stage == "Mail-00") {
        // console.log(ctx.message.text)
        const text = ctx.message.text
        const user_id = ctx.message.from.id
        const dbuser = await User.findOne({ userid: user_id })
        const mess = await Message.findOne({ stage: dbuser.stage })
        ctx.deleteMessage()
        dbuser.mail = {
            file_id: text,
            user_id: user_id,
            moder: false,
            sends: 0,
            format: "text",
        }
        await dbuser.save()
        await ctx.reply(text)
        await ctx.reply(mess.message[2], Markup.inlineKeyboard([
            [Markup.button.callback("Отправить", "mail-yes")],
            [Markup.button.callback("Вернуться в главное меню ↩️", "start")]]))

    }
})



bot.launch()





