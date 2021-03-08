import React, { forwardRef, memo, useCallback, useRef, useState } from 'react';
import './portal.component.scss';
import { StudentModel } from "@interfaces/interfaces";
import { useRxEffect } from "@utilities/utils";
import { $ApiService } from "@services/api.service";
import { Button, Icon, Image, Input, List } from "semantic-ui-react";
import { cloneDeep } from "lodash";


interface Props {
}

interface State {
	loading: boolean;
	sourceList: StudentModel[];
	list: StudentModel[];
	expandedList: number[];

}

export interface Ref {
}

const initialState = (props: Props) => {
	return {
		loading: false,
		sourceList: [],
		list: [],
		expandedList: [],
	};
};

export const PortalComponent = memo(
	forwardRef<Ref, Props>((props, ref) => {
		const [state, setState] = useState<State>(initialState(props));
		const searchByName = useRef<HTMLInputElement>(null);
		const searchByTag = useRef<HTMLInputElement>(null);

		useRxEffect(() => $ApiService.getStudents().subscribe(res => {
			const list = cloneDeep(res);
			const sourceList = cloneDeep(res);


			setState(prevState => ({...prevState, list, sourceList}));
		}), []);


		const handleFilterStudents = useCallback(() => {

			const searchName = (searchByName.current?.value || '').toLowerCase();
			const searchTag = (searchByTag.current?.value || '').toLowerCase();

			console.log('gaga-------------------------------------', state.sourceList[0].tagList);

			const list = cloneDeep(state.sourceList).filter(item => {
				return item.firstName.toLowerCase().includes(searchName)
					|| item.lastName.toLowerCase().includes(searchName)
					|| item.tagList?.includes(searchTag);
			});

			setState(prevState => ({...prevState, list, expandedList: []}));


		}, [state]);

		const handleExpand = useCallback((index) => {
			return () => {
				let expandedList = state.expandedList;

				if (expandedList.includes(index)) {
					expandedList = expandedList.filter(item => item !== index);
				} else {
					expandedList.push(index);
				}
				console.log('expandedList-------------------------------------', expandedList);

				setState(prevState => ({...prevState, expandedList}));
			};
		}, [state]);


		const handleTagChange = useCallback((index) => {
			return (e: React.ChangeEvent<HTMLInputElement>) => {
				const sourceList = state.sourceList;
				const list = state.list;

				sourceList[index].tag = e.target.value;
				list[index].tag = e.target.value;

				setState(prevState => ({...prevState, sourceList, list}));
			};
		}, [state]);

		const handleTagEnter = useCallback((index) => {
			return (e: React.KeyboardEvent<HTMLInputElement>) => {
				if (e.code === 'Enter') {
					const sourceList = state.sourceList;
					const list = state.list;

					sourceList[index].tagList.push(sourceList[index].tag);
					list[index].tagList.push(list[index].tag);

					sourceList[index].tag = '';
					list[index].tag = '';

					setState(prevState => ({...prevState, sourceList, list}));


				}
			};
		}, [state]);

		return (

			<div className="portal-wrap">

				<div className="container">
					<div className={'search-wrap'}>
						<Input
							iconPosition='left'
							placeholder='Search by name'>
							<Icon name='user'/>
							<input
								ref={searchByName}
								onChange={handleFilterStudents}/>
						</Input>
					</div>
					<div className={'tag-wrap'}>
						<Input
							iconPosition='left'
							placeholder='Search by tag'>
							<Icon name='tag'/>
							<input
								ref={searchByTag}
								onChange={handleFilterStudents}/>
						</Input>
					</div>


					<div className={'list-wrap'}>

						<List
							divided
							verticalAlign='middle'>

							{
								state.list.map((item, index) => {

									const avg: any = item.grades.reduce((prev, curr): any => (Number(prev) || 0) + (Number(curr) || 0));

									return (
										<List.Item
											{...(state.expandedList.includes(index)) ? {className: 'expanded'} : {}}
											key={item.id}>
											<Image
												avatar
												src={item.pic}/>


											<div className={'list-content'}>
												<List.Content className={'name-wrap'}>{`${item.firstName} ${item.lastName}`}</List.Content>
												<div>Email: {item.email}</div>
												<div>Company: {item.company}</div>
												<div>Skill: {item.skill}</div>
												<div>Average%: {avg / item.grades.length}%</div>

												<div className={'tag-wrap'}>
													<div className={'tag-list-wrap'}>
														{
															item.tagList.map((tagItem, tagIndex) => {
																return <Button
																	key={tagIndex}
																	size={'mini'}>{tagItem}</Button>;
															})
														}
													</div>
													<div className={'tag-input-wrap'}>
														<Input
															onChange={handleTagChange(index)}
															onKeyUp={handleTagEnter(index)}
															value={item.tag}
															size='mini'
															placeholder='Add tag'/>
													</div>
												</div>

												<div className={'test-wrap'}>
													{
														item.grades.map((grade, ind) => {
															return (
																<div key={ind}>
																	<span>{`Test ${ind + 1}: `}</span>
																	<span>{`${grade}%`}</span>
																</div>
															);
														})
													}
												</div>
											</div>

											<Button
												onClick={handleExpand(index)}
												className={'btn-plus'}
												circular
												icon={(state.expandedList.includes(index)) ? 'minus' : 'plus'}/>
										</List.Item>
									);
								})
							}
						</List>

					</div>

				</div>


			</div>
		);
	}),
);


