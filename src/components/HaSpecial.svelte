<script>
    import { Input } from "@sveltestrap/sveltestrap";

    import { haShowAcctType } from "../sharedState.svelte.js";

    let radioGroup = $state();

    const selAcctType = (e) => {
        let selAcctType = e.currentTarget.value;
        console.log("selAcctType", selAcctType);
        haShowAcctType.set(selAcctType);
    };
</script>

<span class="haShowReg">
    <Input
    reverse
    type="radio"
    bind:group={radioGroup}
    value="a"
    onclick={selAcctType}
    label="Regular"
/>
</span>
<span class="haShowGC">
    <Input
    reverse
    type="radio"
    bind:group={radioGroup}
    value="g"
    onclick={selAcctType}
    label="Gift Card"
/>
</span>
<span class="haShowEmp">
    <Input
    reverse
    type="radio"
    bind:group={radioGroup}
    value="e"
    onclick={selAcctType}
    label="Employee"
/>
</span>

<style>
    .haShowReg {
        color: #333333;
        font-weight: bold;
    }
    .haShowGC {
        color: #cc9900;
        font-weight: bold;
    }
    .haShowEmp {
        color: #ff6633;
        font-weight: bold;
    }
</style>
