<template>
	<section>
		<div class="bk-panel mb20">
			<div class="bk-panel-body p25">
				<form class="bk-form">
					<div class="row">
						<!-- 交互说明: 选中条件后给A标签添加类 on -->
						<div id="time" class="col-md-12 col-lg-12 col-xs-12 mb15">
							<label class="bk-label pr15" style="width:100px;">提交时间：</label>
							<a class="bk-button bk-default bk-button-small check-list-button" title="" :class="topTime===0?'on':''" @click="updateTopTime(0)">
								<span>全部</span>
							</a>
							<a class="bk-button bk-default bk-button-small check-list-button" title="" :class="topTime===1?'on':''" @click="updateTopTime(1)">
								<span>最近一小时</span>
							</a>
							<a class="bk-button bk-default bk-button-small check-list-button" title="" :class="topTime===24?'on':''" @click="updateTopTime(24)">
								<span>最近一天</span>
							</a>
						</div>
						<div id="status" class="col-md-12 col-lg-12 col-xs-12 mb15">
							<label class="bk-label pr15" style="width:100px;">当前状态：</label>
							<a class="bk-button bk-default bk-button-small check-list-button" title="" :class="orderState===0?'on':''" @click="updateOrderState(0)">
								<span>全部</span>
							</a>
							<a class="bk-button bk-default bk-button-small check-list-button" title="" :class="orderState===350?'on':''" @click="updateOrderState(350)">
								<span>生成成功</span>
							</a>
							<a class="bk-button bk-default bk-button-small check-list-button" title="" :class="orderState===20?'on':''" @click="updateOrderState(20)">
								<span>生成失败</span>
							</a>
						</div>
					</div>
					<div class="row more-query-cont mb15">
						<div class="col-md-5 col-lg-5 col-xs-5">
							<div class="bk-form-item mb20">
								<label class="bk-label pr15" style="width:100px;">订单号：</label>
								<div class="bk-form-content" style="margin-left:100px;">
									<input type="text" class="bk-form-input" style="width:100%;" v-model="orderNo">
								</div>
							</div>
						</div>
						<div class="col-md-12 col-lg-12 col-xs-12">
							<div class="bk-form-content" style="margin-left:100px;">
								<button class="bk-button bk-success" @click="onSubmitQuery">查询</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
		<!-- 主要表格 -->
		<div class="bk-panel bk-demo">
			<div class="bk-panel-header" role="tab">
				<div class="bk-panel-action fl">
					<div class="bk-form bk-inline-form bk-form-small">
						<div class="bk-form-item is-required">

						</div>
					</div>
				</div>
				<div class="bk-panel-action fr">
					<div class="bk-form bk-inline-form bk-form-small">
						<div class="bk-form-item is-required">
							<div class="bk-form-content">
								<button class="bk-button bk-primary bk-button-small" title="新增订单" @click="showNewOrderDialog">新增订单</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="bk-panel-body p0">
				<table class="bk-table has-thead-bordered">
					<thead>
						<tr>
							<!-- <th style="width:25px">
                            <input type="checkbox" name="checkall" value="">
                        </th> -->
							<th>订单号</th>
							<th>律所</th>
							<th>当前状态
								<span class="inf" style="font-size:12px; color#
                                    :#888;">（成功/失败/总 ）</span>
							</th>
							<th>提交时间</th>
							<th style="width:325px">操作</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="orderItem in orderList">
							<td>{{orderItem.orderId}}</td>
							<td>{{orderItem.lawFirmName}}</td>
							<td>
								<el-popover v-if="orderItem.orderState===20" placement="left" title="失败原因：" width="200" trigger="hover">
									<span class="fb bk-text-danger" v-html="orderItem.memo||'未知错误'"></span>
									<span slot="reference" v-html="orderStateText(orderItem)"></span>
								</el-popover>
								<div v-else v-html="orderStateText(orderItem)">
								</div>
							</td>
							<td>{{dateTime(orderItem.createTime)}}</td>
							<td>
								<a class="bk-text-button" @click="viewOrderDetail(orderItem.orderId)">查看详情</a>
								<template v-if="orderItem.orderState===100">
									<span>正在打包上传中，请耐心等待5~10分钟</span>
								</template>
								<template v-if="orderItem.orderState===350">
									<a v-if="orderItem.packageUrl" class="bk-text-button" :href="orderItem.packageUrl">打包下载</a>
								</template>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="bk-panel-footer p10">

				<div class="bk-page bk-compact-page fr">
					<ul>
						<li class="page-item">
							<a class="page-button" @click="onClickPrevPage">
								<i class="bk-icon icon-angle-left"></i>
							</a>
						</li>
						<li class="page-item" v-for="pageIndex in pageIndexList" :class="curPageIndex===pageIndex?'cur-page':''">
							<a class="page-button" @click="onClickSomePage(pageIndex)">{{pageIndex}}</a>
						</li>
						<li class="page-item">
							<a class="page-button" @click="onClickNextPage">
								<i class="bk-icon icon-angle-right"></i>
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<el-dialog title="新增电子信函订单" v-model="newOrderVisible" :close-on-click-modal="false">
			<div class="modal-body ffs-modal new-order">
				<div class="cont mb0">
					<form class="bk-form" id="validate_form" method="POST" action="javascript:;">
						<div class="bk-form-item">
							<label class="bk-label">律所：</label>
							<div class="bk-form-content">
								<span class="bk-label-text">互金服律所</span>
							</div>
						</div>
						<div class="bk-form-item mt5">
							<label class="bk-label">选择模板：</label>
							<div class="bk-form-content">
								<select name="validation_select" class="bk-form-select" v-model="selectedTemplateId">
									<option class="hide"></option>
									<option v-for="templateData in templateList" :value="templateData.templateId">
										{{templateData.templateName}}
									</option>
								</select>
							</div>
						</div>
						<div class="bk-form-item mt5 mb20">
							<label class="bk-label">模板内容：</label>
							<div class="bk-form-content">
								<img class="temp-img" :src="templateContent">
							</div>
						</div>
						<!-- <div class="bk-form-item mt5">
                        </div> -->
						<!-- <div class="bk-form-item mt5">
                            <label class="bk-label">电子签名：</label>
                            <div class="bk-form-content">
                                <label class="bk-form-radio">
                                    <input type="radio" name="radio2" value="1" v-model="isNeedSign">
                                    <i class="bk-radio-text">是</i>
                                </label>
                                <label class="bk-form-radio">
                                    <input type="radio" name="radio2" value="0" v-model="isNeedSign">
                                    <i class="bk-radio-text">否</i>
                                </label>
                            </div>
                        </div> -->

						<div class="bk-form-item mt5 mb15" v-show="isSyncSendSms=='1'">
							<label class="bk-label">短信内容：</label>
							<div class="bk-form-content">
								<span class="bk-label-text">{{smsNotice}}</span>
							</div>
						</div>
						<div class="bk-form-item mt5">
							<label class="bk-label">上传号码包：</label>
							<div class="bk-form-content pt5">
								<el-upload class="upload-demo" :action="uploadPolicy.host" :on-remove="uploadRemove" :file-list="fileList" :on-success="uploadSuccess" :data="uploadConfig.data" :on-error="uploadError" :before-upload="beforeUpload">
									<el-button size="small" type="primary">点击上传</el-button>
									<div slot="tip" class="el-upload__tip">只能上传Excel文件</div>
								</el-upload>
							</div>
							<div class="bk-form-content pt5">
								<a class="bk-text-button bk-info" title="下载号码包模板，请按照模板填充内容" href="http://fafashe.oss-cn-shenzhen.aliyuncs.com/template/%E7%94%B5%E5%AD%90%E4%BF%A1%E5%87%BD%E5%8F%B7%E7%A0%81%E5%8C%85%E6%A8%A1%E6%9D%BF.xlsx" download>下载号码包模板，请按照模板填充内容</a>
							</div>
						</div>

					</form>
				</div>
			</div>
			<div class="modal-footer ta-c">
				<a class="bk-button bk-primary" title="提交订单" @click="onSubmitOrder" v-loading="isSubmittingOrder">提交订单</a>
			</div>
		</el-dialog>
		<el-dialog title="订单详情" v-model="viewOrderDetailShow" :close-on-click-modal="false">
			<div class="modal-body ffs-modal">
				<div class="info" v-show="!viewDetailListShow">
					<div class="cont">
						<h5>下单信息</h5>
						<form class="bk-form" id="validate_form" method="POST" action="javascript:;">
							<div class="bk-form-item">
								<label class="bk-label">订单类型：</label>
								<div class="bk-form-content">
									<input type="text" class="bk-form-input" name="" placeholder="" :value="orderBaseInfo.orderType" readonly>
								</div>
							</div>
							<div class="bk-form-item mt5">
								<label class="bk-label">订单来源：</label>
								<div class="bk-form-content">
									<input type="text" class="bk-form-input" name="" placeholder="" :value="orderBaseInfo.orderSource" readonly>
								</div>
							</div>
							<div class="bk-form-item mt5">
								<label class="bk-label">订单单号：</label>
								<div class="bk-form-content">
									<input type="text" class="bk-form-input" name="" placeholder="" :value="orderBaseInfo.orderId" readonly>
								</div>
							</div>
							<div class="bk-form-item mt5">
								<label class="bk-label">下单时间：</label>
								<div class="bk-form-content">
									<input type="text" class="bk-form-input" name="" placeholder="" :value="orderBaseInfo.createTime" readonly>
								</div>
							</div>
							<div class="bk-form-item mt5">
								<label class="bk-label">联系电话：</label>
								<div class="bk-form-content">
									<input type="text" class="bk-form-input" name="" placeholder="" :value="orderBaseInfo.phoneNum" readonly>
								</div>
							</div>
						</form>
					</div>
					<div class="cont">
						<h5>业务信息</h5>
						<form class="bk-form" id="validate_form" method="POST" action="javascript:;">
							<!-- <div class="bk-form-item">
                                <label class="bk-label">订单类型：</label>
                                <div class="bk-form-content">
                                    <input type="text" class="bk-form-input" name="" placeholder="" value="短信" readonly>
                                </div>
                            </div> -->
							<div class="bk-form-item mt5">
								<label class="bk-label">律所：</label>
								<div class="bk-form-content">
									<input type="text" class="bk-form-input" name="" placeholder="" :value="orderBaseInfo.lawFirmName" readonly>
								</div>
							</div>
							<div class="bk-form-item mt5">
								<label class="bk-label">模板名称：</label>
								<div class="bk-form-content">
									<input type="text" class="bk-form-input" name="" placeholder="" :value="orderBaseInfo.templateName" readonly>
								</div>
							</div>
							<div class="bk-form-item mt5">
								<label class="bk-label">模板：</label>
								<div class="bk-form-content">
									<el-popover ref="popover1" placement="right" :title="orderBaseInfo.templateName" width="300" trigger="hover">
										<div class="el-row ">
											<span @click="dialogImage(orderBaseInfo.templateContent)" style="position: absolute; top:0;right: 0; width: 60px; height: 60px; margin-left:-30px; margin-top: -30px;  color:#8492a6; font-size: 50px;">
												<i class="el-icon-view"></i>
											</span>
											<img style="width: 100%;" :src="orderBaseInfo.templateContent" title="邮件信息模版">
										</div>
									</el-popover>
									<div class="bk-text-button bk-info divInline ml0" style=" margin-left: 10px; display:inline" v-popover:popover1>
										<a class="bk-text-button bk-info ml10" target="_blank" :title="orderBaseInfo.templateName">查看模板</a>
									</div>
									<!-- <a class="bk-text-button bk-info ml10" target="_blank" :href="orderBaseInfo.templateContent" title="查看模板">查看模板</a> -->
								</div>
							</div>
							<div class="bk-form-item mt5">
								<label class="bk-label">发送明细：</label>
								<div class="bk-form-content">
									<a class="bk-text-button bk-info ml10" title="查看明细" @click="viewDetailList">查看明细</a>
								</div>
							</div>
							<div class="bk-form-item mt5">
								<label class="bk-label">号码包：</label>
								<div class="bk-form-content">
									<a class="bk-text-button bk-info ml10" title="查看号码包" :href="orderBaseInfo.attatchUrl" download>查看号码包</a>
								</div>
							</div>
						</form>
					</div>
				</div>
				<div class="info" v-show="viewDetailListShow">
					<div class="cont-btns">
						<a id="back_cont" class="bk-button bk-default bk-button-small mb15 fl" title="返回" @click="closeDetailList">
							<span>返回</span>
						</a>
					</div>
					<div class="bk-panel bk-demo">
						<div class="bk-panel-header" role="tab">
							<div class="bk-panel-info fl">
								<div class="panel-title">信函发送明细</div>
							</div>
						</div>
						<div class="bk-panel-body">
							<table class="bk-table">
								<thead>
									<tr>
										<th>号码</th>
										<th>发送状态</th>
										<th>下载协议</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="deliveryDetail in sendDetailList">
										<td>{{deliveryDetail.email}}</td>
										<td>
											<el-popover v-if="deliveryDetail.state===3" placement="left" title="失败原因：" width="260" trigger="hover" :content="deliveryDetail.failReason||'未知错误'">
												<span slot="reference" v-html="smsSendStateText(deliveryDetail.state)">
												</span>
											</el-popover>
											<div v-else v-html="smsSendStateText(deliveryDetail.state)">
											</div>
										</td>
										<td>
											<a class="bk-text-button" :href="deliveryDetail.url" download>下载电子协议</a>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div class="bk-panel-footer">
							<div class="bk-page bk-compact-page fr">
								<ul>
									<li class="page-item">
										<a class="page-button" @click="onClickPrevPageDetail">
											<i class="bk-icon icon-angle-left"></i>
										</a>
									</li>
									<li class="page-item">
										<a class="page-button" @click="onClickNextPageDetail">
											<i class="bk-icon icon-angle-right"></i>
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer ta-c">
				<a class="bk-button bk-primary" data-dismiss="modal" title="关闭" @click="closeViewOrderDetail">关闭</a>
			</div>
		</el-dialog>
		<el-dialog v-model="dialogVisible" size="">
			<img width="100%" :src="dialogImageUrl" alt="large">
		</el-dialog>
	</section>
</template>
<script>
import moment from 'moment'
import { Message } from 'element-ui'
import { md5 } from '../utils/util_main'
export default {
  data() {
    return {
      enterpriseTelphone: '',
      newOrderVisible: false,
      topTime: 0,
      orderState: 0,
      orderNo: '',
      listLoading: false,
      orderList: [],
      pageIndexList: [],
      curPageIndex: 1,
      viewOrderDetailShow: false,
      viewDetailListShow: false,
      orderType: 20,
      templateList: [],
      selectedTemplateId: 0,
      templateContent: '',
      isSubmittingOrder: false,
      orderBaseInfo: {
        orderType: '',
        orderSource: '',
        orderId: '',
        createTime: '',
        phoneNum: '',
        lawFirmName: '',
        templateName: '',
        templateContent: '',
        sendTime: '',
        arriveTime: '',
        orderState: 0,
        successNum: 0,
        totalNum: 0,
        attatchUrl: ''
      },
      viewingOrderId: '',
      curSendDetailPageIndex: 0,
      sendDetailList: [],
      sendDetailIsMore: false,
      isSyncSendSms: '2',
      isNeedSign: '0',
      sendMethod: 2, //1:短信 2:邮件 3：邮件和短信
      uploadPolicy: {
        host: ''
      },
      uploadConfig: {
        multiple: true,
        thread: 5,
        data: {},
        accept: '.xlsx'
      },
      fileList: [],
      uploadFileUrl: '',
      templateExcelUrl: '',
      smsNotice: '',
      checkList: ['邮箱发送'],
      dialogVisible: false,
      dialogImageUrl: ''
    }
  },
  watch: {
    selectedTemplateId: function() {
      for (var index in this.templateList) {
        var templateData = this.templateList[index]
        if (this.selectedTemplateId === templateData.templateId) {
          this.templateContent = templateData.templateContent
          this.templateExcelUrl = templateData.excelUrl
          this.smsNotice = templateData.smsNotice
        }
      }
    }
  },
  methods: {
    dialogImage(val) {
      this.dialogImageUrl = val
      this.dialogVisible = true
    },
    showNewOrderDialog: function() {
      this.newOrderVisible = true
      let reqParam = {}
      reqParam = {
        lawFirmId: 1,
        templateType: 2
      }
      this.$http.ajaxGet(
        {
          url: 'lawFirm/templateListQuery',
          params: reqParam
        },
        res => {
          this.$http.aop(res, isSuccess => {
            if (res.body.data.templateList) {
              this.templateList = res.body.data.templateList
              var firstTemplate = this.templateList[0]
              this.selectedTemplateId = firstTemplate.templateId
            }
          })
        }
      )
      this.$http.ajaxGet(
        {
          url: 'media/getAliyunPostPolicy'
        },
        res => {
          this.$http.aop(res, isSuccess => {
            if (isSuccess) {
              this.uploadPolicy = res.body.data || {}
              this.uploadConfig.data.policy = this.uploadPolicy.policy
              this.uploadConfig.data.OSSAccessKeyId = this.uploadPolicy.accessid
              this.uploadConfig.data.signature = this.uploadPolicy.signature
            }
          })
        }
      )
    },
    uploadSuccess(response, file, fileList) {
      //文件长传成功
      let url = this.uploadPolicy.host + '/' + this.uploadConfig.data.key
      this.uploadFileUrl = url
    },
    beforeUpload(file) {
      let key =
        this.uploadPolicy.dir +
        '/' +
        md5('' + Date.now + this.uploadPolicy.filename + Math.random())
      this.uploadConfig.data.key = key

      return true
    },

    uploadRemove(file, fileList) {
      if (fileList.length > 0) {
        this.fileList = fileList.slice(-1)
      }
    },
    uploadChange(file, fileList) {
      if (fileList.length > 0) {
        this.fileList = fileList.slice(-1)
      } else {
        this.fileList = []
      }
    },
    uploadError(file, fileList) {
      this.$message({
        type: 'info',
        message: '文件上传失败'
      })
    },
    updateTopTime: function(curVal) {
      this.topTime = curVal
    },
    updateOrderState: function(curVal) {
      this.orderState = curVal
    },
    onSubmitQuery: function() {
      this.curPageIndex = 1
      this.getOrderListFromSvr()
    },
    dateTime(val) {
      var date = new Date(val * 1000)
      var Y = date.getFullYear() + '-'
      var M =
        (date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) + '-'
      var D =
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
      var h =
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      var m =
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
        ':'
      var s =
        date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      return Y + M + D + h + m + s
    },
    orderStateText(opts) {
      switch (opts.orderState) {
        case 100:
          return '<span class="fb bk-text-info ml0">生成中</span>'
        case 350:
          return (
            '<span class="fb bk-text-success ml0 ">发送成功</span>（' +
            opts.succNum +
            ' / <i class="fb bk-text-danger">' +
            opts.failNum +
            '</i> / ' +
            opts.totalNum +
            '）'
          )
        case 20:
          return '<span class="fb bk-text-danger ml0 ">生成失败 <i class="el-icon-warning" style="color:#D3DCE6;"> </i></span>'
        default:
          return '<span class="fb bk-text-info ml0">未知状态</span>'
      }
    },
    smsSendStateText(val) {
      switch (val) {
        case 1:
          return '<span class="fb bk-text-info ml0">生成中</span>'
        case 2:
          return '<span class="fb bk-text-success ml0 ">生成成功</span>'
        case 3:
          return '<span class="fb bk-text-danger ml0 ">生成失败 <i class="el-icon-warning" style="color:#D3DCE6;"> </i></span>'
        default:
          return '<span class="fb bk-text-info ml0">未知状态</span>'
      }
    },
    downloadAgreement(urlVal) {
      var aLink = document.createElement('a')
      var blob = new Blob(['www.baidu.com'])
      var evt = document.createEvent('HTMLEvents')
      evt.initEvent('click', false, false) //initEvent 不加后两个参数在FF下会报错, 感谢 Barret Lee 的反馈
      aLink.download = '协议'
      aLink.href = URL.createObjectURL(blob)
      aLink.dispatchEvent(evt)
    },
    viewOrderDetail: function(curOrderId) {
      this.viewOrderDetailShow = true
      this.viewDetailListShow = false
      this.viewingOrderId = curOrderId
      let reqParam = {}
      reqParam = {
        orderId: curOrderId
      }
      this.$http.ajaxGet(
        {
          url: 'order/detailQuery',
          params: reqParam
        },
        res => {
          this.$http.aop(res, isSuccess => {
            var baseInfo = res.body.data.base
            var detailInfo = res.body.data.detail
            this.orderBaseInfo.orderType = '电子信函'
            this.orderBaseInfo.orderSource = baseInfo.name
            this.orderBaseInfo.orderId = baseInfo.orderId
            this.orderBaseInfo.createTime = this.dateTime(baseInfo.createTime)
            this.orderBaseInfo.phoneNum = baseInfo.telephone
            this.orderBaseInfo.lawFirmName = baseInfo.lawFirmName
            this.orderBaseInfo.templateName = detailInfo.templateName
            this.orderBaseInfo.templateContent = detailInfo.templateContent
            this.orderBaseInfo.attatchUrl = detailInfo.attachmentUrl
            this.orderBaseInfo.orderState = baseInfo.orderState
            this.orderBaseInfo.successNum = baseInfo.succNum
            this.orderBaseInfo.totalNum = baseInfo.totalNum
          })
        }
      )
    },
    onClickPrevPage: function() {
      this.curPageIndex--
      if (this.curPageIndex <= 0) {
        this.curPageIndex = 1
      }
      this.getOrderListFromSvr()
    },
    onClickNextPage: function() {
      this.curPageIndex++
      if (this.curPageIndex > this.totalPageNum) {
        this.curPageIndex = this.totalPageNum
      }
      this.getOrderListFromSvr()
    },
    onClickSomePage: function(curVal) {
      this.curPageIndex = curVal
      this.getOrderListFromSvr()
    },
    viewDetailList: function() {
      this.viewDetailListShow = true
      let reqParam = {}
      reqParam = {
        orderId: this.viewingOrderId,
        pageNo: this.curSendDetailPageIndex
      }
      this.$http.ajaxGet(
        {
          url: 'order/deliveryDetailListQuery',
          params: reqParam
        },
        res => {
          this.$http.aop(res, isSuccess => {
            if (isSuccess) {
              this.sendDetailList = res.body.data.detailList
              if (res.body.data.more) {
                this.sendDetailIsMore = true
              } else {
                this.sendDetailIsMore = false
              }
            }
          })
        }
      )
    },

    onClickPrevPageDetail: function() {
      if (this.curSendDetailPageIndex > 0) {
        this.curSendDetailPageIndex--
      } else {
        this.curSendDetailPageIndex = 0
      }
      this.viewDetailList()
    },
    onClickNextPageDetail: function() {
      if (this.sendDetailIsMore) {
        this.curSendDetailPageIndex++
        this.viewDetailList()
      }
    },
    closeDetailList: function() {
      this.viewDetailListShow = false
      this.curSendDetailPageIndex = 0
    },
    closeViewOrderDetail: function() {
      this.viewOrderDetailShow = false
    },
    getOrderListFromSvr() {
      let reqParam = {}
      reqParam = {
        orderType: 30,
        orderState: this.orderState,
        hours: this.topTime,
        orderId: this.orderNo,
        pageNo: this.curPageIndex - 1
      }
      this.listLoading = true
      this.$http.ajaxGet(
        {
          url: 'order/listQuery',
          params: reqParam
        },
        res => {
          this.$http.aop(res, isSuccess => {
            var total = res.body.data.total
            var pageSize = res.body.data.pageSize
            if (res.body.data.orderList instanceof Array) {
              this.orderList = res.body.data.orderList
            } else {
              this.orderList = []
            }
            var totalPageNum = Math.floor(total / pageSize) + 1
            for (var index = 0; index < totalPageNum; index++) {
              this.pageIndexList[index] = index + 1
            }
            this.listLoading = false
          })
        }
      )
    },
    handleCheckeChange(value) {
      let checkedCount = value.length
      if (checkedCount == 1) {
        if (value[0] == '短信发送') {
          this.isSyncSendSms = 1
          //this.isNeedSign = 0;
          this.sendMethod = 1
        } else {
          this.isSyncSendSms = 2
          //this.isNeedSign = 0;
          this.sendMethod = 2
        }
      } else if (checkedCount > 1) {
        this.isSyncSendSms = 1
        this.isNeedSign = 0
        this.sendMethod = 3
      } else {
        this.isSyncSendSms = 2
      }
    },
    onSubmitOrder: function() {
      if (this.uploadFileUrl == '') {
        Message.warning('请选择文件上传号码包')
        return
      }
      if (this.selectedTemplateId == 0) {
        Message.warning('请选择短信模版')
        return
      }
      // if(this.checkList.length<1){
      //     Message.warning('请选择发送方式');
      //     return;
      // }
      let reqParam = {}
      reqParam = {
        orderType: 30,
        lawFirmId: 1,
        templateId: this.selectedTemplateId,
        attachmentUrl: this.uploadFileUrl,
        //sendMethod: parseInt(this.sendMethod),
        needSign: parseInt(this.isNeedSign)
      }
      // console.log(reqParam);
      // return;
      this.isSubmittingOrder = true
      this.$http.ajaxGet(
        {
          url: 'order/create',
          params: reqParam
        },
        res => {
          this.$http.aop(res, isSuccess => {
            if (isSuccess) {
              Message.success('下单成功')
              this.newOrderVisible = false
            }

            this.isSubmittingOrder = false
            this.getOrderListFromSvr()
          })
        }
      )

      setTimeout(() => {
        this.isSubmittingOrder = false
      }, 3000)
    }
  },
  mounted() {
    this.getOrderListFromSvr()
  }
}
</script>
<style>
.el-upload__input {
  display: none;
}

input[type='file'] {
  display: none;
}

a:hover {
  cursor: pointer;
}
</style>