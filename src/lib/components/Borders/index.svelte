<script>
	export let isProtruded = true;
	export let isFixed = false;
	export let width = '0.65rem';
	export let height = '0.65rem';
	export let lightBarOpacity = '0.5';
	export let darkBarOpacity = '0.25';
	export let applyZIndex = false;
	export let needOverflowSupport = false;
	export let outlineWidth = '1px';

	const getStyle = (axis, barMode) => {
		let style = {
			verticallight: `
                width: ${width};
                opacity: ${lightBarOpacity};
                outline-width: ${outlineWidth};
                outline-color: #414141;
            `,
			verticaldark: `
                width: ${width};
                opacity: ${darkBarOpacity};
                outline-width: ${outlineWidth};
                outline-color: #636363;
            `,
			horizontallight: `
                height: ${height};
                opacity: ${lightBarOpacity};
                outline-width: ${outlineWidth};
                outline-color: #414141;
            `,
			horizontaldark: `
                height: ${height};
                opacity: ${darkBarOpacity};
                outline-width: ${outlineWidth};
                outline-color: #636363;
            `
		};

		let key = [axis, barMode].join('');

		return style[key];
	};
</script>

{#if needOverflowSupport}
	<div
		style={[getStyle('vertical', 'light'), 'opacity: 1;'].join('')}
		class={`${isFixed ? 'fixed' : 'absolute'} ${!isProtruded && 'left-auto'} ${
			applyZIndex && 'z-[1]'
		} inset-0 bg-[#4F4F4F]`}
	/>
	<div
		style={[getStyle('horizontal', 'light'), 'opacity: 1;'].join('')}
		class={`${isFixed ? 'fixed' : 'absolute'} ${!isProtruded && 'top-auto'} ${
			applyZIndex && 'z-[1]'
		} inset-0 bg-[#4F4F4F]`}
	/>
	<div
		style={[getStyle('vertical', 'dark'), 'opacity: 1;'].join('')}
		class={`${isFixed ? 'fixed' : 'absolute'} ${isProtruded && 'left-auto'} ${
			applyZIndex && 'z-[1]'
		} inset-0 bg-[#4F4F4F]`}
	/>
	<div
		style={[getStyle('horizontal', 'dark'), 'opacity: 1;'].join('')}
		class={`${isFixed ? 'fixed' : 'absolute'} ${isProtruded && 'top-auto'} ${
			applyZIndex && 'z-[1]'
		} inset-0 bg-[#4F4F4F]`}
	/>
{/if}

<div
	style={[getStyle('vertical', 'light'), `outline-width: ${outlineWidth};`].join(' ')}
	class={`${isFixed ? 'fixed' : 'absolute'} ${!isProtruded && 'left-auto'} ${
		applyZIndex && 'z-10'
	} inset-0 outline bg-[#797979]`}
/>
<div
	style={[getStyle('horizontal', 'light'), `outline-width: ${outlineWidth};`].join(' ')}
	class={`${isFixed ? 'fixed' : 'absolute'} ${!isProtruded && 'top-auto'} ${
		applyZIndex && 'z-10'
	} inset-0 outline bg-[#797979]`}
/>
<div
	style={[getStyle('vertical', 'dark'), `outline-width: ${outlineWidth};`].join(' ')}
	class={`${isFixed ? 'fixed' : 'absolute'} ${isProtruded && 'left-auto'} ${
		applyZIndex && 'z-10'
	} inset-0 outline bg-[#222222]`}
/>
<div
	style={[getStyle('horizontal', 'dark'), `outline-width: ${outlineWidth};`].join(' ')}
	class={`${isFixed ? 'fixed' : 'absolute'} ${isProtruded && 'top-auto'} ${
		applyZIndex && 'z-10'
	} inset-0 outline bg-[#222222]`}
/>
