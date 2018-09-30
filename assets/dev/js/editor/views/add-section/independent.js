import BaseAddSectionView from './base';

class AddSectionView extends BaseAddSectionView {
	get id() {
		return 'qazana-add-new-section';
	}

	onCloseButtonClick() {
		this.closeSelectPresets();
	}
}

export default AddSectionView;
