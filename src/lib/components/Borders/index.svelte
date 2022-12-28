<script>
    export let isProtruded = true;
    export let isFixed = false;
    export let width = '0.65rem';
    export let height = '0.65rem';
    export let lightBarOpacity = '0.5';
    export let darkBarOpacity = '0.25';
    export let applyZIndex = false;
    export let needOverflowSupport = false;
    
    const getStyle = (axis,barMode) => {

        let style = {
            'verticallight': `
                width: ${width};
                opacity: ${lightBarOpacity};
            `,
            'verticaldark': `
                width: ${width};
                opacity: ${darkBarOpacity};
            `,
            'horizontallight': `
                height: ${height};
                opacity: ${lightBarOpacity};
            `,
            'horizontaldark': `
                height: ${height};
                opacity: ${darkBarOpacity};
            `
        }

        let key = [axis, barMode].join('')
        
        return style[key]
    }
</script>

{#if needOverflowSupport}
<div style={[getStyle('vertical', 'light'),'opacity: 1;'].join('')} class={`${isFixed? 'fixed': 'absolute'} ${!isProtruded && 'left-auto'} ${applyZIndex && 'z-[1]'} inset-0 bg-[#4F4F4F]`} />
<div style={[getStyle('horizontal', 'light'),'opacity: 1;'].join('')} class={`${isFixed? 'fixed': 'absolute'} ${!isProtruded && 'top-auto'} ${applyZIndex && 'z-[1]'} inset-0 bg-[#4F4F4F]`} />
<div style={[getStyle('vertical', 'dark'),'opacity: 1;'].join('')} class={`${isFixed? 'fixed': 'absolute'} ${isProtruded && 'left-auto'} ${applyZIndex && 'z-[1]'} inset-0 bg-[#4F4F4F]`} />
<div style={[getStyle('horizontal', 'dark'),'opacity: 1;'].join('')} class={`${isFixed? 'fixed': 'absolute'} ${isProtruded && 'top-auto'} ${applyZIndex && 'z-[1]'} inset-0 bg-[#4F4F4F]`} />
{/if}

<div style={getStyle('vertical', 'light')} class={`${isFixed? 'fixed': 'absolute'} ${!isProtruded && 'left-auto'} ${applyZIndex && 'z-10'} inset-0 bg-[#797979]`} />
<div style={getStyle('horizontal', 'light')} class={`${isFixed? 'fixed': 'absolute'} ${!isProtruded && 'top-auto'} ${applyZIndex && 'z-10'} inset-0 bg-[#797979]`} />
<div style={getStyle('vertical', 'dark')} class={`${isFixed? 'fixed': 'absolute'} ${isProtruded && 'left-auto'} ${applyZIndex && 'z-10'} inset-0 bg-[#222222]`} />
<div style={getStyle('horizontal', 'dark')} class={`${isFixed? 'fixed': 'absolute'} ${isProtruded && 'top-auto'} ${applyZIndex && 'z-10'} inset-0 bg-[#222222]`} />
