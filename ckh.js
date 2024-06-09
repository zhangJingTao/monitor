// ==UserScript==

// @name         创客汇自动审批

// @namespace    http://tampermonkey.net/

// @version      0.7

// @description  网络慢的时候，增加缓慢模式

// @author       You

// @match        https://p.rrswl.com

// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==

// @grant        none

// ==/UserScript==

(async function () {

    'use strict';
// ==UserScript==

// @name         创客汇自动审批

// @namespace    http://tampermonkey.net/

// @version      0.7

// @description  网络慢的时候，增加缓慢模式

// @author       You

// @match        https://p.rrswl.com

// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==

// @grant        none

// ==/UserScript==

(async function () {

    'use strict';

    /**

    扩展方法

    **/

    async function sleep(ms) {

        return new Promise((resolve) => setTimeout(resolve, ms));

    }

    Array.prototype.contains = function (val) {

        for (var i = 0; i < this.length; i++) {

            if (this[i] == val) {

                return true;

            }

        }

        return false;

    };

    //开始

    var wentao = ["新云仓", "BMS", "KXBMS", "KX", "CLP订舱", "FMS", "干线TMS", "SRM", "IN+", "TMS智能物流调度平台"]

    var gaoshuai = ["SQM", "TMS", "一路顺APP", "调度中心", "云顺", "新云仓-区配", "新云仓-统仓","智链宝","日日辔","顺智通","CDK"]

    var mix = ["OMS", "商城ERP", "快线结算平台", "虎翼CRM", "IWMS"]

    console.log("开始自动审批")

    var nowHours = new Date().getHours();



    await sleep(3000);



        //判断一下是否有，没有休息一下 然后刷新页面

        var pageSize = document.getElementsByClassName("el-pagination__total")[0].innerText.trim();

        if (pageSize == '共 0 条') {

            console.log("没有内容")

            await sleep(1000 * 60 * 3);

            location.reload();

        }

        console.log(document.getElementsByClassName('col_3')[1]);

        document.getElementsByClassName('col_3')[1].children[0].children[0].click();

        console.log("打开表单")

        await sleep(5000);

    try {

        var sys = document.getElementsByClassName("el-selector__tags-text")[2].innerText.trim();

        var dbaddrs = document.getElementsByName("databaseAddress")[0].value;

        var title = document.getElementsByClassName("title")[0].innerText.trim()

        var updateTitle = document.getElementsByName("title")[0].value;

        if (sys.length == 0 || dbaddrs.length == 0) {

            //加载慢，再等5mins

            await sleep(5000);

            sys = document.getElementsByClassName("el-selector__tags-text")[2].innerText.trim();

            dbaddrs = document.getElementsByName("databaseAddress")[0].value;

            title = document.getElementsByClassName("title")[0].innerText.trim()

            updateTitle = document.getElementsByName("title")[0].value;

        }

        if (title == "数据变更申请") {

            document.getElementsByName("agree")[0].click()

            //自动统一审批

            await sleep(3000);

            var assign = "wentao"

            console.log(document.getElementsByClassName("el-radio__original"))

            var buts = document.getElementsByClassName("el-button--primary")

            try {

                if (updateTitle.indexOf("归档") >= 0) {

                    document.getElementsByClassName("el-radio__original")[0].click()

                    assign = "gaoshuai"

                } else {

                    if (wentao.contains(sys)) {

                        document.getElementsByClassName("el-radio__original")[1].click()

                    } else if (gaoshuai.contains(sys)) {

                        document.getElementsByClassName("el-radio__original")[0].click()

                        assign = "gaoshuai"

                    } else if (mix.contains(sys)) {

                        if (dbaddrs.toLowerCase().indexOf("mysql") >= 0 || dbaddrs.toLowerCase().indexOf("mycat") >= 0 || dbaddrs.toLowerCase().indexOf("aliyun") >= 0) {

                            document.getElementsByClassName("el-radio__original")[1].click()

                        } else {

                            document.getElementsByClassName("el-radio__original")[0].click()

                            assign = "gaoshuai"

                        }

                    } else {

                        fetch('https://open.feishu.cn/open-apis/bot/v2/hook/65c08198-6572-48be-a86f-ebe176edb988', {

                            method: 'POST',

                            headers: {

                                'Content-Type': 'application/json'

                            },

                            body: JSON.stringify({

                                "msg_type": "text",

                                "content": {

                                    "text": "发现不支持自动审批的系统，系统名称" + sys

                                }

                            })

                        })

                            .then(response => {

                                if (response.ok) {

                                    // 请求成功处理逻辑

                                    console.log('POST请求成功');

                                } else {

                                    // 请求失败处理逻辑

                                    console.error('POST请求失败');

                                }

                            })

                            .catch(error => {

                                // 错误处理逻辑

                                console.error('发生错误:', error);

                            });

                        await sleep(1000 * 60 * 20);

                        location.reload();

                    }

                }

            } catch (e) {

                console.log(e)

            }

            await sleep(500);

            localStorage.setItem("autoAgree" + Math.round(new Date()), "sys:" + sys + "||dbaddrs:" + dbaddrs)

            document.getElementsByClassName("el-button--primary")[buts.length - 1].click()

            await sleep(500);

            location.reload();

        } else if (title == "数据库发版...暂停了") {

            document.getElementsByClassName("tagsContent-search")[0].click()

            await sleep(1500);

            if (wentao.contains(sys)) {

                document.getElementsByClassName("el-radio__input")[1].click()

            } else if (gaoshuai.contains(sys)) {

                document.getElementsByClassName("el-radio__input")[0].click()

                assign = "gaoshuai"

            } else if (mix.contains(sys)) {

                document.getElementsByClassName("el-radio__input")[0].click()

                assign = "gaoshuai"

            }

            await sleep(1500);

            document.getElementsByName("confirm")[3].click()

            await sleep(1500);

            document.getElementsByName("agree")[0].click()

            await sleep(1500);

            document.getElementsByClassName("el-button--primary")[17].click()

            location.reload();

        } else {

            fetch('https://open.feishu.cn/open-apis/bot/v2/hook/65c08198-6572-48be-a86f-ebe176edb988', {

                method: 'POST',

                headers: {

                    'Content-Type': 'application/json'

                },

                body: JSON.stringify({

                    "msg_type": "text",

                    "content": {

                        "text": "发现非数据库变更申请，请及时手动审核：" + title

                    }

                })

            })

                .then(response => {

                    if (response.ok) {

                        // 请求成功处理逻辑

                        console.log('POST请求成功');

                    } else {

                        // 请求失败处理逻辑

                        console.error('POST请求失败');

                    }

                })

                .catch(error => {

                    // 错误处理逻辑

                    console.error('发生错误:', error);

                });

            await sleep(1000 * 60 * 20);

            location.reload();

        }

    } catch (e) {

        console.log(e)

        location.reload();

    }

})();
    /**

    扩展方法

    **/

    async function sleep(ms) {

        return new Promise((resolve) => setTimeout(resolve, ms));

    }

    Array.prototype.contains = function (val) {

        for (var i = 0; i < this.length; i++) {

            if (this[i] == val) {

                return true;

            }

        }

        return false;

    };

    //开始

    var wentao = ["新云仓", "BMS", "KXBMS", "KX", "CLP订舱", "FMS", "干线TMS", "SRM", "IN+", "TMS智能物流调度平台"]

    var gaoshuai = ["SQM", "TMS", "一路顺APP", "调度中心", "云顺", "新云仓-区配", "新云仓-统仓","智链宝","日日辔","顺智通","CDK"]

    var mix = ["OMS", "商城ERP", "快线结算平台", "虎翼CRM", "IWMS"]

    console.log("开始自动审批")

    var nowHours = new Date().getHours();



    await sleep(3000);



        //判断一下是否有，没有休息一下 然后刷新页面

        var pageSize = document.getElementsByClassName("el-pagination__total")[0].innerText.trim();

        if (pageSize == '共 0 条') {

            console.log("没有内容")

            await sleep(1000 * 60 * 3);

            location.reload();

        }

        console.log(document.getElementsByClassName('col_3')[1]);

        document.getElementsByClassName('col_3')[1].children[0].children[0].click();

        console.log("打开表单")

        await sleep(5000);

    try {

        var sys = document.getElementsByClassName("el-selector__tags-text")[2].innerText.trim();

        var dbaddrs = document.getElementsByName("databaseAddress")[0].value;

        var title = document.getElementsByClassName("title")[0].innerText.trim()

        var updateTitle = document.getElementsByName("title")[0].value;

        if (sys.length == 0 || dbaddrs.length == 0) {

            //加载慢，再等5mins

            await sleep(5000);

            sys = document.getElementsByClassName("el-selector__tags-text")[2].innerText.trim();

            dbaddrs = document.getElementsByName("databaseAddress")[0].value;

            title = document.getElementsByClassName("title")[0].innerText.trim()

            updateTitle = document.getElementsByName("title")[0].value;

        }

        if (title == "数据变更申请") {

            document.getElementsByName("agree")[0].click()

            //自动统一审批

            await sleep(3000);

            var assign = "wentao"

            console.log(document.getElementsByClassName("el-radio__original"))

            var buts = document.getElementsByClassName("el-button--primary")

            try {

                if (updateTitle.indexOf("归档") >= 0) {

                    document.getElementsByClassName("el-radio__original")[0].click()

                    assign = "gaoshuai"

                } else {

                    if (wentao.contains(sys)) {

                        document.getElementsByClassName("el-radio__original")[1].click()

                    } else if (gaoshuai.contains(sys)) {

                        document.getElementsByClassName("el-radio__original")[0].click()

                        assign = "gaoshuai"

                    } else if (mix.contains(sys)) {

                        if (dbaddrs.toLowerCase().indexOf("mysql") >= 0 || dbaddrs.toLowerCase().indexOf("mycat") >= 0 || dbaddrs.toLowerCase().indexOf("aliyun") >= 0) {

                            document.getElementsByClassName("el-radio__original")[1].click()

                        } else {

                            document.getElementsByClassName("el-radio__original")[0].click()

                            assign = "gaoshuai"

                        }

                    } else {

                        fetch('https://open.feishu.cn/open-apis/bot/v2/hook/65c08198-6572-48be-a86f-ebe176edb988', {

                            method: 'POST',

                            headers: {

                                'Content-Type': 'application/json'

                            },

                            body: JSON.stringify({

                                "msg_type": "text",

                                "content": {

                                    "text": "发现不支持自动审批的系统，系统名称" + sys

                                }

                            })

                        })

                            .then(response => {

                                if (response.ok) {

                                    // 请求成功处理逻辑

                                    console.log('POST请求成功');

                                } else {

                                    // 请求失败处理逻辑

                                    console.error('POST请求失败');

                                }

                            })

                            .catch(error => {

                                // 错误处理逻辑

                                console.error('发生错误:', error);

                            });

                        await sleep(1000 * 60 * 20);

                        location.reload();

                    }

                }

            } catch (e) {

                console.log(e)

            }

            await sleep(500);

            localStorage.setItem("autoAgree" + Math.round(new Date()), "sys:" + sys + "||dbaddrs:" + dbaddrs)

            document.getElementsByClassName("el-button--primary")[buts.length - 1].click()

            await sleep(500);

            location.reload();

        } else if (title == "数据库发版...暂停了") {

            document.getElementsByClassName("tagsContent-search")[0].click()

            await sleep(1500);

            if (wentao.contains(sys)) {

                document.getElementsByClassName("el-radio__input")[1].click()

            } else if (gaoshuai.contains(sys)) {

                document.getElementsByClassName("el-radio__input")[0].click()

                assign = "gaoshuai"

            } else if (mix.contains(sys)) {

                document.getElementsByClassName("el-radio__input")[0].click()

                assign = "gaoshuai"

            }

            await sleep(1500);

            document.getElementsByName("confirm")[3].click()

            await sleep(1500);

            document.getElementsByName("agree")[0].click()

            await sleep(1500);

            document.getElementsByClassName("el-button--primary")[17].click()

            location.reload();

        } else {

            fetch('https://open.feishu.cn/open-apis/bot/v2/hook/65c08198-6572-48be-a86f-ebe176edb988', {

                method: 'POST',

                headers: {

                    'Content-Type': 'application/json'

                },

                body: JSON.stringify({

                    "msg_type": "text",

                    "content": {

                        "text": "发现非数据库变更申请，请及时手动审核：" + title

                    }

                })

            })

                .then(response => {

                    if (response.ok) {

                        // 请求成功处理逻辑

                        console.log('POST请求成功');

                    } else {

                        // 请求失败处理逻辑

                        console.error('POST请求失败');

                    }

                })

                .catch(error => {

                    // 错误处理逻辑

                    console.error('发生错误:', error);

                });

            await sleep(1000 * 60 * 20);

            location.reload();

        }

    } catch (e) {

        console.log(e)

        location.reload();

    }

})();
