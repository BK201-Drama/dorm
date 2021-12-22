<template>
	<view>
		<view class="uni-header">
			<view class="uni-group hide-on-phone">
				<view class="uni-title">申请信息</view>
				<view class="uni-sub-title"></view>
			</view>
			<view class="uni-group">
				<input class="uni-search" type="text" v-model="query" @confirm="search" placeholder="请输入搜索内容" />
				<button class="uni-button" type="default" size="mini" @click="search">搜索</button>
			</view>
		</view>
		<view class="uni-container">
			<unicloud-db ref="udb" @load="onqueryload" collection="allocateMessage" :options="options"
				:where="where" field="_id,studentID,name,gender,degree,dormBuildingNo,dormRoomNo,applyStatus,lastdormBuildingNo"
				page-data="replace" :orderby="orderby" :getcount="true" :page-size="options.pageSize"
				:page-current="options.pageCurrent" v-slot:default="{data,pagination,loading,error}">
				<uni-table :loading="loading" :emptyText="error.message || '没有更多数据'" border stripe type="selection"
					@selection-change="selectionChange">
					<uni-tr>
						<uni-th align="center">学号</uni-th>
						<uni-th align="center">名称</uni-th>
						<uni-th align="center">性别</uni-th>
						<uni-th align="center">角色</uni-th>
						<uni-th align="center">年级</uni-th>
						<uni-th align="center">宿舍楼</uni-th>
						<uni-th align="center">原宿舍楼</uni-th>
						<uni-th align="center">原宿舍号</uni-th>
						<uni-th align="center">申请状态</uni-th>	
						<uni-th align="center">操作</uni-th>		
					</uni-tr>
					<uni-tr v-for="(item,index) in data" :key="index">
						<uni-td align="center">{{item.studentID}}</uni-td>
						<uni-td align="center">{{item.name}}</uni-td>
						<uni-td align="center">{{item.gender==1?"男":item.gender==2?"女":"未知"}}</uni-td>
						<uni-td align="center">学生</uni-td>
						<uni-td align="center">{{item.degree}}</uni-td>
						<uni-td align="center">{{item.dormBuildingNo}}</uni-td>
						<uni-td align="center">{{item.lastdormBuildingNo}}</uni-td>
						<uni-td align="center">{{item.dormRoomNo}}</uni-td>
						<uni-td align="center">{{parseApplyStatus(item.applyStatus)}}</uni-td>
						<uni-td align="center">
							<view class="uni-group" v-if="$hasRole('dormManger')">								
								<button @click="navigateTo('./edit?id='+item._id, false)" class="uni-button" size="mini"
									type="primary">分配</button>							
							</view>
						</uni-td>
					</uni-tr>
				</uni-table>
				<view class="uni-pagination-box">
					<picker class="select-picker" mode="selector" :value="pageSizeIndex" :range="pageSizeOption"
						@change="changeSize">
						<button type="default" size="mini" :plain="true">
							<text>{{pageSizeOption[pageSizeIndex]}} 条/页</text>
							<uni-icons class="select-picker-icon" type="arrowdown" size="12" color="#999"></uni-icons>
						</button>
					</picker>
					<uni-pagination show-icon :page-size="pagination.size" v-model="pagination.current"
						:total="pagination.count" @change="onPageChanged" />
				</view>
			</unicloud-db>
		</view>
		<!-- #ifndef H5 -->
		<fix-window />
		<!-- #endif -->
	</view>
</template>

<script>
	const db = uniCloud.database()
	// 表查询配置
	const dbOrderBy = 'register_date desc' // 排序字段
	const dbSearchFields = ["studentID","lastdormBuildingNo"] // 支持模糊搜索的字段列表
	// 分页配置
	const pageSize = 20
	const pageCurrent = 1

	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				query: '',
				where: '',
				orderby: dbOrderBy,
				options: {
					pageSize,
					pageCurrent
				},
				selectedIndexs: [], //批量选中的项
				pageSizeIndex: 0,
				pageSizeOption: [5, 15, 25, 50, 100],	
				formData: {
				  "name": "",
				  "studentID": "",
				  "dormBuildingNo": "",
				  "gender": 0,
				  "role": ["student"],
				  "degree": "",
				  "dormRoomNo": "",
				  "status": 0,
				  "applyStatus":''
				},
			}			
		},
		computed: {
			...mapState('user', ['userInfo']),
		},
		watch: {
			pageSizeIndex: {
				immediate: true,
				handler(val, old) {
					this.options.pageSize = this.pageSizeOption[val]
					this.options.pageCurrent = 1
				}
			}
		},
		onLoad(){
			var that =this
			uni.getStorage({
				key:'role',
				success:(res)=>{
					// console.log(res.data[0])
					if(res.data[0] ==="dormManger"){
						uni.getStorage({
							key:'dormBuildingNo',
							success:(res)=>{
								console.log(res.data[0])
								that.where = "dormBuildingNo=='"+res.data[0]+"'"								
							}		
						})
					}				
				}
			})				
		},
		methods: {
			onqueryload(data) {
			},
			changeSize(e) {
				this.pageSizeIndex = e.detail.value
			},
			getWhere() {
				const query = this.query.trim()
				if (!query) {
					return ''
				}
				const queryRe = new RegExp(query, 'i')
				return dbSearchFields.map(name => queryRe + '.test(' + name + ')').join(' || ')
			},
			search(e) {
				const newWhere = this.getWhere()
				const isSameWhere = newWhere === this.where
				this.where = newWhere
				if (isSameWhere) { // 相同条件时，手动强制刷新
					this.loadData()
				}
			},
			loadData(clear = true) {
				this.$refs.udb.loadData({
					clear
				})
			},
			onPageChanged(e) {
				this.options.pageCurrent = e.current
			},
			navigateTo(url, clear) { // clear 表示刷新列表时是否清除当前页码，true 表示刷新并回到列表第 1 页，默认为 true
				uni.navigateTo({
					url,
					events: {
						refreshData: () => {
							this.loadData(clear)
						}
					}
				})
			},
			// 多选处理
			selectedItems() {
				var dataList = this.$refs.udb.dataList
				return this.selectedIndexs.map(i => dataList[i]._id)
			},
			//批量删除
			delTable() {
				const ids = this.selectedItems()
				const currentUserId = this.userInfo._id
				if (ids.includes(currentUserId)) {
					uni.showToast({
						icon: 'none',
						title: '当前账号不能删除自己',
						duration: 1500
					})
					return
				}
				this.$refs.udb.remove(ids)
			},
			// 多选
			selectionChange(e) {
				this.selectedIndexs = e.detail.index
			},
			confirmDelete(item) {
				const currentUserId = this.userInfo._id
				if (currentUserId === item._id) {
					uni.showToast({
						icon: 'none',
						title: '不允许 admin 账号删除自己',
						duration: 1500
					})
					return
				}
				this.$refs.udb.remove(item._id)
			},
			parseApplyStatus(status) {
				if (status === 0) {
					return '审核中'
				} else if (status === 1) {
					return '审核通过'
				} else if (status === 2) {
					return '审核不通过'
				}
				else{
					return'无'
				}
			}
		}
	}
</script>
<style>
	/* #ifndef H5 */
	page {
		padding-top: 85px;
	}

	/* #endif */
</style>