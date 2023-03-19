<script lang="ts">
    // export let
    export let onFileDrop: (list: FileList) => void;

    let isDraggingOver = false;
    const handleDragEnter = (event: DragEvent) => {
        event.preventDefault();
        isDraggingOver = true;
    };

    const handleDragLeave = (event: DragEvent) => {
        event.preventDefault();
        isDraggingOver = false;
    };

    const handleDrop = (event: DragEvent) => {
        event.preventDefault();
        isDraggingOver = false;
        onFileDrop(event.dataTransfer.files);
    };

    const handleChange = (
        event: Event & {
            currentTarget: EventTarget & HTMLInputElement;
        }
    ) => {
        onFileDrop(event.currentTarget.files);
    };
</script>

<label
    class="dropzone {isDraggingOver ? 'dragging' : ''}"
    on:dragenter={handleDragEnter}
    on:dragover={handleDragEnter}
    on:dragleave={handleDragLeave}
    on:drop={handleDrop}
    on:dragstart={() => console.log("Hey")}
>
    Drop here
    <input type="file" on:input={handleChange} accept=".png" hidden />
</label>

<style lang="scss">
    label {
        width: 100%;
        height: 200px;
        border: 2px dashed #f0f0f0;
        font-size: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        &.dragging {
            color: #182433;
            background-color: #f0f0f0;
        }
    }
</style>
