<template>
    <div class="page">
        <div class="top">
            <span class="top-text">姓名：{{ system.card.cardInfo?.fullName }}</span>
            <span class="top-text">卡号：{{ system.card.cardInfo?.cardNo }}</span>
            <span class="top-text">可圈存金额：{{ amount }}元</span>
        </div>
        <el-table class-name="table-content" ref="multipleTableRef" :data="tableData" tooltip-effect="dark"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="缴费订单" width="250">
                <template #default="scope">
                    <div class="table-text">{{ scope.row.orderCode }}</div>
                </template>
            </el-table-column>
            <el-table-column label="缴费金额" width="120">
                <template #default="scope">
                    <div class="table-text">{{ scope.row.amount }}</div>
                </template>
            </el-table-column>
            <el-table-column label="状态" width="100">
                <template #default="scope">
                    <div style="display: flex; justify-content: center; align-items: center">
                        <div class="round"></div>
                        <div class="table-text" style="color: #ff7700" v-if="scope.row.entrapStatus === false">
                            未圈存
                        </div>
                        <div class="table-text" style="color: #318800" v-else>未圈存</div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="来源" width="120">
                <template #default="scope">
                    <div class="table-text">
                        {{
                            system.dataDictionary.paySource.find(
                                (item: any) => item.value == scope.row.paySource
                            )?.label
                        }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="圈存时间">
                <template #default="scope">
                    <div class="table-text">{{ scope.row.payTime }}</div>
                </template>
            </el-table-column>
        </el-table>
        <div class="button_parent">
            <ubutton @handler="goback()" :text="'返回'" :model="1"></ubutton>
            <ubutton @handler="confirm()" :text="'圈存'" :model="2"></ubutton>
        </div>
        <loading v-if="dialogVisible" title="圈存中..." message="正在圈存中，请勿移动卡片......"></loading>
    </div>
</template>

<script setup lang="ts">
import loading from "@/components/loading.vue";
import {
    defineComponent,
    reactive,
    ref,
    toRefs,
    unref,
    watch,
    watchEffect,
} from "vue";
import ubutton from "@/components/button.vue";
import { ElTable } from "element-plus";
import { Router, RouteLocationRaw, useRouter } from "vue-router";
import { useMainStore } from "@/stores/index";
import * as API from "@/api/index";

const router: Router = useRouter();
const system = useMainStore();
system.viewName = "圈存";
interface table {
    amount: string;
    entrapStatus: number;
    orderCode: string;
    payId: number;
    paySource: number;
    payTime: string;
}
const tableData = ref<Array<table>>([]);
const dialogVisible = ref<Boolean>(false);
const amount = ref<number>(0);

const multipleSelection = ref<Array<table>>([]);
query();
function query() {
    const data = {
        cardNo: system.card.cardNumber,
        cardType: system.card.cardType,
    };
    API.queryWaitEntrap(data)
        .then((res: any) => {
            tableData.value = res.result;
            updateAmount()
        })
        .catch((res) => { })
        .finally((res: void) => { });
}

function handleSelectionChange(val: table[]) {
    multipleSelection.value = val;
}
function handleClose() { }
function goback() {
    router.go(-1);
}

// 更新可圈存金额
function updateAmount() {
    tableData.value.forEach((item: table) => {
        amount.value += Number(item.amount);
    });
}
//圈存
function confirm() {
    if (multipleSelection.value.length === 0) {
        system.setMessage("请选择待圈存项");
        return;
    }
    dialogVisible.value = true;
    setTimeout(() => {
        dialogVisible.value = false;
    }, 1000);
    let payIds: Array<number> = [];
    let amount = 0;
    multipleSelection.value.forEach((item: table) => {
        payIds.push(item.payId);
        amount += Number(item.amount);
    });
    API.entrap({
        cardNo: system.card.cardNumber,
        cardType: system.card.cardType,
        payIds: payIds.toString(),
    })
        .then((res: any) => {
            if (res.code === 200 && res.success === true) {
                // 圈存成功
                const routeLocation: RouteLocationRaw = {
                    path: "/coilTips",
                    query: {
                        state: "true",
                        amount
                    },
                };
                router.push(routeLocation);
            } else {
                // 圈存失败
                // system.setMessage(res.message)
                const routeLocation: RouteLocationRaw = {
                    path: "/coilTips",
                    query: {
                        state: "false",
                        amount
                    },
                };
                router.push(routeLocation);
            }

            query()
        })
        .catch((res) => {
            system.setMessage(res.message);
        })
        .finally(() => {
            // dialogVisible.value = false;
        });
}
</script>

<style lang="less" scoped>
.margin_1 {
    margin-top: 100px;
}

.margin_2 {
    margin-top: 50px;
    margin-bottom: 100px;
}

/deep/ .eldialog {
    width: 620px;
    height: 640px;
    background: #ffffff;
    border-radius: 20px 20px 20px 20px;
    opacity: 1;

    .el-dialog__header {
        display: none;
    }

    .el-dialog__body {
        padding: 0;
        height: 100%;
    }

    .content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-top: 100px;
    }

    .tip-text {
        font-size: 26px;
        font-family: Source Han Sans CN-Medium, Source Han Sans CN;
        font-weight: 500;
        color: #666666;
        line-height: 0px;
        -webkit-background-clip: text;
        // -webkit-text-fill-color: transparent;
    }
}

.page {
    width: 1430px;
    // margin-left: 245px;
}

.top {
    margin-top: 40px;
    width: 1430px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

/deep/ .table-content {
    margin-top: 40px;
    width: 1430px;
    height: 658px;
    background: #ffffff;
    border-radius: 20px 20px 20px 20px;
    opacity: 1;
    overflow: hidden;

    .el-table__header-wrapper {
        .is-indeterminate .el-checkbox__inner {
            border-color: #318800;
            background-color: #318800;

            &::before {
                top: 15px;
                height: 3px;
                background-color: #ffffff;
                transform: none;
                width: 20px;
                left: 5px;
            }
        }
    }

    // background-color: red;
    .round {
        width: 10px;
        height: 10px;
        background: #ff7700;
        opacity: 1;
        border-radius: 50%;
        margin-right: 15px;
    }

    .table-text {
        font-size: 24px;
        font-family: Source Han Sans CN-Regular, Source Han Sans CN;
        font-weight: 400;
        color: #333333;
        // line-height: 24px;
        -webkit-background-clip: text;
        // -webkit-text-fill-color: transparent;
    }

    .el-table__cell {
        padding: 25px 0;
        text-align: center;
    }

    thead {
        .el-table__cell {
            font-size: 24px;
            font-family: Source Han Sans CN-Medium, Source Han Sans CN;
            // font-weight: 500;
            color: #333333;
            // line-height: 0px;
            -webkit-background-clip: text;
            // -webkit-text-fill-color: transparent;
        }
    }

    // 修改表格所有多选框的样式 start
    .el-table-column--selection {
        .cell {
            height: 34px;
        }
    }

    .el-checkbox__inner {
        width: 34px;
        height: 34px;

        &::after {
            border: 2px solid #fff;
            border-left: 0;
            border-top: 0;
            left: 10px;
            top: 10px;
        }
    }

    // 表行选择器样式覆盖
    .el-checkbox__input.is-checked {
        .el-checkbox__inner {
            border-color: #318800;
            background-color: #318800;

            &::after {
                left: 12px;
                top: 8px;
                height: 10px;
                width: 5px;
            }
        }

        .el-checkbox__inner::after {
            transform: rotate(50deg) scaleY(1.3);
        }
    }

    // 修改表格所有多选框的样式 end
}

.top-text {
    //     width: 180px;
    // height: 36px;
    font-size: 36px;
    font-family: Source Han Sans CN-Bold, Source Han Sans CN;
    // font-weight: bold;
    line-height: 36px;
    color: #333333;
    font-weight: bold;
    // line-height: 0px;
    -webkit-background-clip: text;
    // -webkit-text-fill-color: transparent;
}

.spinner {
    width: 112px;
    height: 112px;
    display: grid;
    border: 6px solid #0000;
    border-radius: 50%;
    border-color: #318800 #0000;
    animation: spinner-e04l1k 1s infinite linear;
}

.spinner::before,
.spinner::after {
    content: "";
    grid-area: 1/1;
    margin: 4.4px;
    border: inherit;
    border-radius: 50%;
    border-color: #66cd00 #0000;
}

.spinner::before {
    border-color: #ffc107 #0000;
    animation: inherit;
    animation-duration: 0.5s;
    animation-direction: reverse;
}

.spinner::after {
    margin: 17.8px;
}

@keyframes spinner-e04l1k {
    100% {
        transform: rotate(1turn);
    }
}
</style>
