<template>
	<view class="header">
		<view class="navbar" :class="{'navbar-mini':!matchLeftWindow,'popup-menu':popupMenuOpened}">
			<view class="navbar-left pointer">
				<navigator class="logo" open-type="reLaunch" url="/">
					<image src="../static/logo.png" mode="heightFix"></image>
					<text>{{appName}}</text>
				</navigator>
				<uni-icons @click="toggleSidebar" type="bars" class="menu-icon" size="30" color="#999"></uni-icons>
			</view>
			<view class="navbar-middle">
				<text class="title-text">{{navigationBarTitleText}}</text>
			</view>
			<view class="navbar-right pointer">
				<view v-show="userInfo.username" @click="togglePopupMenu" class="navbar-user">
					<view class="username"><text>{{userInfo.username}}</text></view>
					<uni-icons class="arrowdown" type="arrowdown" color="#666" size="13"></uni-icons>
				</view>
				<view class="uni-mask" @click="togglePopupMenu"></view>
				<view class="navbar-menu">
					<!-- #ifdef H5 -->
					<view v-if="logs.length" @click="showErrorLogs" class="menu-item debug pointer">
						<svg class="svg-icon">
							<use xlink:href="#icon-bug"></use>
						</svg>
						<uni-badge class="debug-badge" :text="logs.length" type="error"></uni-badge>
					</view>
					<!-- #endif -->
					<view v-for="link in links" :key="link.url" class="menu-item">
						<uni-link :href="link.url" :text="link.text" color="#666" fontSize="13" style="font-size:12px;" />
					</view>
					<template v-if="userInfo.username">
						<view class="menu-item username">
							<uni-icons class="person" type="person" color="#666" size="13"></uni-icons>
							<text>{{userInfo.username}}</text>
						</view>
						<view class="menu-item" @click="chagePassword">
							<text>修改密码</text>
						</view>
						<view class="menu-item ">
							<text class="logout pointer" @click="logout">退出</text>
						</view>
					</template>
					<view class="popup-menu__arrow"></view>
				</view>
			</view>
		</view>
		<uni-popup ref="errorLogsPopup" type="center">
			<view class="modal">
				<scroll-view class="modal-content" scroll-y="true">
					<error-log class="error-table" />
				</scroll-view>
			</view>
		</uni-popup>
		<uni-popup ref="passwordPopup" type="center">
			<view class="modal" style="width:400px; padding: 20px;">
				<update-password class="password-popup" :isPhone="true" v-on:closePasswordPopup="closePasswordPopup" />
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		mapMutations,
		mapState
	} from 'vuex'

	import errorLog from '@/windows/components/error-log.vue'
	import updatePassword from '@/windows/components/update-password.vue'
	import config from '@/admin.config.js'

	export default {
		components: {
			errorLog,
			updatePassword
		},
		props: {
			navigationBarTitleText: {
				type: String
			},
			matchLeftWindow: {
				type: Boolean
			},
			showLeftWindow: {
				type: Boolean
			}
		},
		data() {
			return {
				...config.navBar,
				popupMenuOpened: false,
				mpCapsule: 0
			}
		},
		computed: {
			...mapState('app', ['appName']),
			...mapState('user', ['userInfo']),
			...mapState('error', ['logs'])
		},
		mounted() {
			// #ifdef MP
			let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			this.mpCapsule = menuButtonInfo.width
			// console.log(111111111,this.mpCapsule)
			// #endif
		},
		methods: {
			...mapMutations({
				removeToken(commit) {
					commit('user/REMOVE_TOKEN')
				}
			}),
			showErrorLogs() {
				if (this.popupMenuOpened) {
					this.popupMenuOpened = false
				}
				this.$refs.errorLogsPopup.open()
			},
			showPasswordPopup() {
				if (this.popupMenuOpened) {
					this.popupMenuOpened = false
				}
				this.$refs.passwordPopup.open()
			},
			logout() {
				this.removeToken()
				uni.reLaunch({
					url: config.login.url
				})
			},
			toggleSidebar() {
				if (!this.showLeftWindow) {
					uni.showLeftWindow()
				} else {
					uni.hideLeftWindow()
				}
			},
			togglePopupMenu() {
				this.popupMenuOpened = !this.popupMenuOpened
			},
			closePasswordPopup() {
				this.$refs.passwordPopup.close()
			},
			toPasswordPage() {
				uni.navigateTo({
					url: '/pages/changepwd/changepwd'
				})
			},
			chagePassword() {
				!this.matchLeftWindow ? this.toPasswordPage() : this.showPasswordPopup()
			}
		}
	}
</script>

<style lang="scss">
	.header {
		height: 60px;
		width: 100%;
		box-sizing: border-box;
		border-bottom: 1px solid darken($top-window-bg-color, 8%);
		background-color: $top-window-bg-color;
		color: $top-window-text-color;
	}

	.navbar {
		font-size: 14px;
		position: relative;
		height: 100%;
		padding: 0 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.logo {

		display: flex;
		align-items: center;

		image {
			height: 30px;
		}

		text {
			margin-left: 8px;
		}
	}

	.menu-icon {
		width: 30px;
		height: 30px;
		line-height: 30px;
	}

	.navbar-left,
	.navbar-middle,
	.navbar-right {
		flex: 1;
		/* #ifdef MP */
		margin-right: 97px;
		/* #endif */
	}

	.navbar-middle,
	.username {
		display: flex;
		align-items: center;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.navbar-middle {
		text-align: center;
	}

	.username {
		max-width: 150px;
	}

	.title-text {
		font-size: 14px;
		line-height: 30px;
	}

	.navbar-menu {
		display: flex;
	}

	.menu-item {
		padding: 8px;
		font-size: 13px;
		color: #666;
	}

	.debug {
		display: inline-block;
		position: relative;
	}

	.debug-badge {
		position: absolute;
		top: 5px;
		right: 14px;
		transform: translateY(-50%) translateX(100%) scale(0.8);
	}

	.arrowdown {
		margin-top: 4px;
		margin-left: 3px;
	}

	.person {
		margin-top: 2px;
		margin-right: 2px;
	}

	.navbar-right {
		display: flex;
		justify-content: flex-end;
	}

	.navbar-right .uni-mask {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(255, 255, 255, 0);
		z-index: 999;
	}

	.popup-menu__arrow {
		position: absolute;
		top: -6px;
		right: 20px;
		border-width: 6px;
		margin-right: 3px;
		border-top-width: 0;
		border-bottom-color: #ebeef5;
		filter: drop-shadow(0 2px 12px rgba(0, 0, 0, .03));
	}

	.popup-menu__arrow::after {
		content: " ";
		position: absolute;
		display: block;
		width: 0;
		height: 0;
		border-color: transparent;
		border-style: solid;
		border-width: 6px;
		top: 1px;
		margin-left: -6px;
		border-top-width: 0;
		border-bottom-color: #fff;
	}

	/* 大屏时，隐藏的内容 */
	.menu-icon,
	.navbar-middle,
	.navbar-user,
	.popup-menu__arrow,
	.navbar-right .uni-mask {
		display: none;
	}

	/* 小屏，显示的内容 */
	.navbar-mini .menu-icon,
	.navbar-mini .navbar-middle {
		display: block;
	}

	.navbar-mini .navbar-user {
		display: flex;
	}

	/* 小屏时，隐藏的内容 */
	.navbar-mini .logo,
	.navbar-mini .debug,
	.navbar-mini .navbar-menu,
	.navbar-mini .navbar-menu .username {
		display: none;
	}

	.navbar-mini .navbar-menu {
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: fixed;
		right: 20px;
		/* #ifdef MP */
		right: 97px;
		/* #endif */
		top: var(--window-top);
		/* #ifndef H5 */
		top: 85px;
		/* #endif */
		background-color: #fff;
		z-index: 999;
		padding: 5px 15px;
		margin: 5px 0;
		background-color: #fff;
		border: 1px solid #ebeef5;
		border-radius: 4px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
	}

	/* 小屏时，弹出下拉菜单 */
	.navbar-mini.popup-menu .navbar-menu {
		display: flex;
	}

	.navbar-mini.popup-menu .popup-menu__arrow,
	.navbar-mini.popup-menu .navbar-right .uni-mask {
		display: block;
	}

	.logout:hover {
		color: $menu-text-color-actived;
	}

	.svg-icon {
		width: 1em;
		height: 1em;
		vertical-align: -.15em;
		fill: currentColor;
		overflow: hidden;
	}

	.modal {
		width: 100%;
		max-width: 980px;
		margin: 0 auto;
		background-color: #FFFFFF;
	}

	.modal-content {
		padding: 15px;
		height: 500px;
		box-sizing: border-box;
	}

	.password-popup {
		padding: 30px;
	}
</style>
