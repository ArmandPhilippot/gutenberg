/**
 * External dependencies
 */
import {
	View,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';

/**
 * WordPress dependencies
 */
import { Platform, useLayoutEffect, useRef } from '@wordpress/element';
import { Icon, AutocompletionItemsFill } from '@wordpress/components';
import { usePreferredColorSchemeStyle } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import getDefaultUseItems from './get-default-use-items';
import styles from './style.scss';

const { compose: stylesCompose } = StyleSheet;

// const isIOS = Platform.OS === 'ios';

export function getAutoCompleterUI( autocompleter ) {
	const useItems = autocompleter.useItems
		? autocompleter.useItems
		: getDefaultUseItems( autocompleter );

	function AutocompleterUI( {
		filterValue,
		selectedIndex,
		onChangeOptions,
		onSelect,
	} ) {
		const [ items ] = useItems( filterValue );
		const scrollViewRef = useRef();

		useLayoutEffect( () => {
			onChangeOptions( items );
			scrollViewRef.current?.scrollTo( { x: 0, animated: false } );
		}, [ items ] );

		const containerStyles = usePreferredColorSchemeStyle(
			styles.container,
			styles.containerDark
		);

		const activeItemStyles = usePreferredColorSchemeStyle(
			styles.activeItem,
			styles.activeItemDark
		);

		const iconStyles = usePreferredColorSchemeStyle(
			styles.icon,
			styles.iconDark
		);

		const textStyles = usePreferredColorSchemeStyle(
			styles.text,
			styles.textDark
		);

		if ( ! items.length > 0 ) {
			return null;
		}

		return (
			<AutocompletionItemsFill>
				<BlurView
					style={ containerStyles }
					blurType="prominent"
					blurAmount={ 10 }
				>
					<ScrollView
						ref={ scrollViewRef }
						horizontal
						contentContainerStyle={ styles.content }
						showsHorizontalScrollIndicator={ false }
						keyboardShouldPersistTaps="always"
					>
						{ items.map( ( option, index ) => {
							const isActive = index === selectedIndex;
							const itemStyle = stylesCompose(
								styles.item,
								isActive && activeItemStyles
							);
							const textStyle = stylesCompose(
								textStyles,
								isActive && styles.activeText
							);

							return (
								<TouchableOpacity
									activeOpacity={ 0.5 }
									style={ itemStyle }
									key={ index }
									onPress={ () => onSelect( option ) }
								>
									<View style={ styles.icon }>
										<Icon
											icon={ option?.value?.icon?.src }
											size={ 24 }
											style={ iconStyles }
										/>
									</View>
									<Text style={ textStyle }>
										{ option?.value?.title }
									</Text>
								</TouchableOpacity>
							);
						} ) }
					</ScrollView>
				</BlurView>
			</AutocompletionItemsFill>
		);
	}

	return AutocompleterUI;
}

export default getAutoCompleterUI;
