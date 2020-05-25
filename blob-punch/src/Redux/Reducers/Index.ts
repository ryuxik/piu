import { combineReducers } from 'redux';
import { entityReducer } from './EntityReducer';
import { projectileReducer } from './ProjectileReducers';
import { weaponReducer } from './WeaponReducers';

const rootReducer = combineReducers({ 
    entity: entityReducer,
    projectile: projectileReducer,
    weapon: weaponReducer
})

export type RootState = ReturnType<typeof rootReducer>