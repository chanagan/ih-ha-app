<script>
    import { Input } from "@sveltestrap/sveltestrap";

    import { haShowGC, haShowEmp } from "../sharedState.svelte.js";

    const toggleGC = (e) => {
        console.log("toggleGC", e.target.checked);
        haShowGC.set(e.target.checked);
    };

    const toggleEmp = (e) => {
        console.log("toggleEmp", e.target.checked);
        haShowEmp.set(e.target.checked);
    };
</script>

<span class="haShowGC">
    <Input reverse
        type="switch"
        checked={haShowGC}
        label="Gift Card"
        id="haShowGC"
        bsSize="sm"
        onclick={toggleGC}
    />
</span>
<span class="haShowEmp">
    <Input reverse
        type="switch"
        checked={haShowEmp}
        label="Employee"
        id="haShowEmp"
        bsSize="sm"
        onclick={toggleEmp}
    />
</span>

<style>
    .haShowGC {
        color: #18966c;
    }
    .haShowEmp {
        color: #961861;
    }
</style>
