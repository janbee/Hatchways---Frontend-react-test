import React, { forwardRef, memo, useState } from 'react';
import { Route, Switch, useHistory } from "react-router-dom";
import { Dimmer, Loader } from "semantic-ui-react";
import { PortalComponent } from "@components/portal/portal.components";

interface Props {
}

interface State {
	loading: boolean;
}

export interface Ref {
}

const initialState = (props: Props) => {
	return {
		loading: true,
	};
};

export const AppComponent = memo(
	forwardRef<Ref, Props>((props, ref) => {
		const [state, setState] = useState<State>(initialState(props));

		return (
			<>
				<Switch>
					<Route
						path={'*'}
						strict={true}
						exact={true}
						component={PortalComponent}/>
				</Switch>
			</>
		);
	}),
);


