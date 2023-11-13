<template>
    <el-container class="root-container">
        <el-aside width="200px">
            <RouterView name="LeftBar"></RouterView>
        </el-aside>
        <el-container>
            <el-main>
                <RouterView ></RouterView>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: 'base-admin-layout'
    }
</script>