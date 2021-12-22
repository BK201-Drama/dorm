<template>
	<view>
		<view class="uni-header">
			<view class="uni-group hide-on-phone">
				<view class="uni-title">宿舍管理</view>
				<view class="uni-sub-title"></view>
			</view>
			<view class="uni-group">
				<input class="uni-search" type="text" v-model="query" @confirm="search" placeholder="请输入搜索内容" />
				<button class="uni-button" type="default" size="mini" @click="search">搜索</button>
				<button class="uni-button" type="primary" size="mini" @click="navigateTo('./add')">新增</button>				
				</download-excel>
			</view>
		</view>
		<view class="uni-container">
			<unicloud-db ref="udb" @load="onqueryload" collection="dorm" :options="options"
				:where="where" field="_id,dormBuildingNo,dormRoomNo,status,number"
				page-data="replace" :orderby="orderby" :getcount="true" :page-size="options.pageSize"
				:page-current="options.pageCurrent" v-slot:default="{data,pagination,loading,error}">
				<uni-table :loading="loading" :emptyText="error.message || '没有更多数据'" border stripe type="selection"
					@selection-change="selectionChange">
					<uni-tr>
						<uni-th align="center" width="100">宿舍楼号</uni-th>
						<uni-th align="center">宿舍号</uni-th>						
						<uni-th align="center">状态</uni-th>
						<uni-th align="center">入住人数</uni-th>
						<uni-th width="204" align="center">操作</uni-th>
					</uni-tr>
					<uni-tr v-for="(item,index) in data" :key="index">
						<uni-td align="center">{{item.dormBuildingNo}}</uni-td>
						<uni-td align="center">{{item.dormRoomNo}}</uni-td>						
						<uni-td align="center">{{parseUserStatus(item.status)}}</uni-td>
						<uni-td align="center">{{item.number}}</uni-td>
						<uni-td align="center">
							<view class="uni-group">
								<button @click="navigateTo('./edit?id='+item._id, false)" class="uni-button" size="mini"
									type="primary">修改</button>
								<button @click="confirmDelete(item)" class="uni-button" size="mini"
									type="warn">删除</button>
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
	const dbSearchFields = ['dormRoomNo'] // 支持模糊搜索的字段列表
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
				pageSizeOption: [5, 10, 20, 25, 50]
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
		methods: {
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
						duration: 1500
					})
					return
				}
				this.$refs.udb.remove(item._id)												
			},
			parseUserStatus(status) {
				if (status === 0) {
					return '正常'
				} else if (status === 1) {
					return '已满'
				} else if (status === 2) {
					return '闲置'
				} else if (status === 3) {
					return '维修'
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
